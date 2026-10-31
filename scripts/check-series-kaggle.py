"""Offline archive integrity, restoration and credential-boundary regressions."""
import importlib.util, pathlib, tempfile, unittest, zipfile, io, hashlib, sys, types, gzip, sqlite3
MODULE = pathlib.Path(__file__).parent / 'lib' / 'series-kaggle.py'
spec = importlib.util.spec_from_file_location('series_kaggle', MODULE)
archive = importlib.util.module_from_spec(spec); spec.loader.exec_module(archive)

class ArchiveChecks(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(); self.root = pathlib.Path(self.temp.name)
        self.source = self.root / 'fixture'; self.source.mkdir()
        (self.source / 'chapter').mkdir(); (self.source / 'chapter' / '正文.txt').write_text('Synthetic fixture only\n中文语境\n', encoding='utf-8')
        (self.source / 'empty-directory').mkdir()
        (self.source / 'asset.bin').write_bytes(bytes(range(256)) * 8)
    def tearDown(self): self.temp.cleanup()
    def build(self, project='language', suffix='package'):
        return archive.build_package(project, self.source, self.root / suffix, inspection_directory=self.root / 'inspection-tmp')
    def test_deterministic_content_addressed_container_and_whole_tree_restore(self):
        first, package, _ = self.build(); other, other_package, _ = self.build(suffix='again')
        self.assertEqual(first, other); self.assertEqual(package.read_bytes(), other_package.read_bytes())
        result = archive.restore_package(first, package, self.root / 'restored', 'language')
        self.assertTrue(result['restored']); self.assertEqual(result['fileCount'], 2)
        self.assertTrue((self.root / 'restored' / 'empty-directory').is_dir())
        for original in self.source.rglob('*'):
            if original.is_file(): self.assertEqual(original.read_bytes(), (self.root / 'restored' / original.relative_to(self.source)).read_bytes())
    def test_modified_package_or_manifest_cannot_restore(self):
        manifest, package, _ = self.build(); package.write_bytes(package.read_bytes()[:-1] + b'X')
        with self.assertRaisesRegex(ValueError, 'integrity'): archive.validate_package(manifest, package, 'language')
        manifest, package, _ = self.build(suffix='fresh'); manifest['content']['files'][0]['bytes'] += 1
        with self.assertRaisesRegex(ValueError, 'digest'): archive.validate_package(manifest, package, 'language')
    def test_project_identity_is_part_of_digest_and_receipt_scope(self):
        first, package, _ = self.build(); other, _, _ = self.build('algorithm', 'algorithm')
        self.assertNotEqual(first['recordId'], other['recordId'])
        with self.assertRaisesRegex(ValueError, 'project'): archive.validate_package(first, package, 'algorithm')
        with self.assertRaisesRegex(ValueError, 'Unsupported'): self.build('paper', 'paper')
    def test_sensitive_paths_and_realistic_secret_shapes_are_rejected(self):
        for name in ('.env', 'kaggle.json', 'api-token.txt', 'server.pem'):
            path = self.source / name; path.write_text('fixture')
            with self.assertRaisesRegex(ValueError, 'Credential'): self.build(suffix='blocked-' + name.replace('.', '_'))
            path.unlink()
        (self.source / 'private').mkdir()
        with self.assertRaisesRegex(ValueError, 'Credential'): self.build(suffix='private-blocked')
        (self.source / 'private').rmdir()
        (self.source / 'note.txt').write_text('sk-proj-' + 'A' * 40)
        with self.assertRaisesRegex(ValueError, '[Cc]redential'): self.build(suffix='key-blocked')
    def test_chapter_authorization_metadata_is_not_a_bearer_credential(self):
        path = self.source / 'meta.json'; path.write_text('{"authorization":"User explicitly authorized preserving the selected words"}')
        self.build(suffix='legitimate-chapter')
        path.write_text('{"authorization":"Bearer fixture-opaque-credential"}')
        with self.assertRaisesRegex(ValueError, '[Cc]redential'): self.build(suffix='header-credential')

    def test_encrypted_credentials_and_nested_containers_are_not_ordinary_assets(self):
        path = self.source / 'ordinary.json'; path.write_text('{"credentials":{"iv":"fixture","data":"encrypted opaque fixture"}}')
        with self.assertRaisesRegex(ValueError, '[Cc]redential'): self.build(suffix='encrypted-json')
        path.unlink(); path = self.source / 'ordinary.json.gz'; path.write_bytes(gzip.compress(b'{"refreshToken":"encrypted-or-plain-fixture"}'))
        with self.assertRaisesRegex(ValueError, '[Cc]redential'): self.build(suffix='gzip-credentials')
        path.unlink(); path = self.source / 'ordinary.zip'
        with zipfile.ZipFile(path, 'w') as nested: nested.writestr('private/credential-store.bin', b'opaque-encrypted-value')
        with self.assertRaisesRegex(ValueError, '[Cc]redential'): self.build(suffix='nested-private')
        path.unlink(); path = self.source / 'data.sqlite'
        connection = sqlite3.connect(path); connection.execute('CREATE TABLE storage_connection(id INTEGER,credentials TEXT)'); connection.execute('INSERT INTO storage_connection VALUES(1,?)', ('{"iv":"fixture","data":"ciphertext"}',)); connection.commit(); connection.close()
        with self.assertRaisesRegex(ValueError, '[Cc]redential'): self.build(suffix='sqlite-credentials')
        self.assertEqual(list((self.root/'inspection-tmp').iterdir()),[])
    def test_normal_sqlite_is_inspected_readonly_and_exact_temporary_files_are_cleaned(self):
        path=self.source/'learning.sqlite';connection=sqlite3.connect(path);connection.execute('CREATE TABLE notes(id INTEGER PRIMARY KEY,text TEXT)');connection.execute("INSERT INTO notes(text) VALUES('safe synthetic fixture')");connection.execute("CREATE TRIGGER no_touch AFTER INSERT ON notes BEGIN SELECT no_user_function(); END;");connection.commit();connection.close()
        original=path.read_bytes();inspection=self.root/'inspection-tmp';inspection.mkdir();sentinel=inspection/'unrelated.keep';sentinel.write_text('preserve')
        manifest,package,_=self.build(suffix='normal-sqlite')
        self.assertEqual(dict(archive.validate_package(manifest,package,'language',inspection_directory=inspection))['learning.sqlite'],original)
        destination=self.root/'sqlite-restored';archive.restore_package(manifest,package,destination,'language',inspection_directory=inspection)
        self.assertEqual((destination/'learning.sqlite').read_bytes(),original);self.assertEqual(path.read_bytes(),original);self.assertEqual(sorted(item.name for item in inspection.iterdir()),['unrelated.keep'])
        with self.assertRaisesRegex(ValueError,'explicit'):archive.build_package('language',self.source,self.root/'missing-runtime-tmp')
        self.assertEqual(sentinel.read_text(),'preserve')

    def test_traversal_duplicate_and_existing_target_are_rejected(self):
        for name in ('../escape', '/absolute', 'a/../b', 'a\\b', 'C:/x', 'a//b', 'a/.env', 'CON.txt', 'a/NUL', 'trailing. ', 'COM1'):
            with self.assertRaises(ValueError): archive.safe_relative(name)
        manifest, package, _ = self.build()
        existing = self.root / 'existing'; existing.mkdir()
        with self.assertRaisesRegex(ValueError, 'already exist'): archive.restore_package(manifest, package, existing, 'language')
    def test_links_cannot_smuggle_unselected_files(self):
        link = self.source / 'link'
        try: link.symlink_to(self.source / 'asset.bin')
        except OSError: self.skipTest('Platform does not grant symbolic link creation')
        with self.assertRaisesRegex(ValueError, 'links'): self.build(suffix='link-blocked')
    def test_limits_stop_before_publication(self):
        old = archive.MAX_PACKAGE
        try:
            archive.MAX_PACKAGE = 1
            with self.assertRaisesRegex(ValueError, '24 MiB'): self.build(suffix='too-large')
        finally: archive.MAX_PACKAGE = old
    def test_existing_historical_record_is_reused_without_a_new_version(self):
        manifest, package, manifest_file = self.build()
        client = archive.ArchiveClient.__new__(archive.ArchiveClient)
        client.root = self.root / 'client'; (client.root / 'tmp').mkdir(parents=True)
        client.owner = 'fixture-owner'
        dataset = types.SimpleNamespace(current_version_number=2, versions=[types.SimpleNamespace(version_number=1)])
        client.dataset = lambda project, allow_absent=False: dataset
        class FakeAPI:
            calls = []
            def dataset_list_files(inner, ref, page_size):
                inner.calls.append(ref)
                name = manifest_file.name if ref.endswith('/1') else 'different.manifest.json'
                return types.SimpleNamespace(error_message=None, next_page_token=None, files=[types.SimpleNamespace(name=name)])
            def dataset_create_new(inner, *args, **kwargs): raise AssertionError('Historical reuse must not create')
            def dataset_create_version(inner, *args, **kwargs): raise AssertionError('Historical reuse must not version')
        client.api = FakeAPI()
        client.download = lambda project, version, name, destination: manifest_file
        client.verify = lambda project, receipt: (manifest, package, {'verified':True,'version':receipt['version']})
        result = client.archive('language', self.source)
        self.assertTrue(result['reused']); self.assertEqual(result['version'], 1)
        self.assertEqual(client.api.calls, ['fixture-owner/second-series-language-archives/2','fixture-owner/second-series-language-archives/1'])
    def test_policy_current_allocation_and_active_resource_are_required_before_new_archive(self):
        import json
        policy=archive.read_json(pathlib.Path(__file__).resolve().parents[1]/'protocol'/'series-storage.json')
        policy_file=self.root/'policy.json'
        for alteration in ('planned-resource','off-resource','planned-allocation','other-project-only'):
            candidate=json.loads(json.dumps(policy))
            if alteration in ('planned-resource','off-resource'):
                next(value for value in candidate['resources'] if value['id']=='kaggle-private-account')['state']='planned' if alteration=='planned-resource' else 'off'
            elif alteration=='planned-allocation':
                next(value for value in candidate['allocations']['language'] if value['resourceId']=='kaggle-private-account')['mode']='planned'
            else:
                candidate['allocations']['language']=[value for value in candidate['allocations']['language'] if value['resourceId']!='kaggle-private-account']
            archive.atomic_json(policy_file,candidate)
            client=archive.ArchiveClient.__new__(archive.ArchiveClient);client.config={'policyFile':str(policy_file),'allowArchive':True};client.root=self.root/'blocked-client';client._archive=lambda *args: self.fail('Policy rejection must happen before archive processing')
            with self.assertRaisesRegex(ValueError,'disabled'):client.archive('language',self.source)
            self.assertFalse((client.root/'locks').exists())
        archive.atomic_json(policy_file,policy)
        self.assertEqual(archive.authorize_archive('language',{'policyFile':str(policy_file)})['administrator'],'language')
        with self.assertRaisesRegex(ValueError,'Unsupported'):archive.authorize_archive('paper',{'policyFile':str(policy_file)})
        with self.assertRaisesRegex(ValueError,'absolute'):archive.authorize_archive('language',{'policyFile':'relative-policy.json'})
    def test_policy_stops_new_archives_but_never_blocks_existing_fixed_version_verification(self):
        manifest,package,manifest_file=self.build()
        policy=archive.read_json(pathlib.Path(__file__).resolve().parents[1]/'protocol'/'series-storage.json')
        next(value for value in policy['resources'] if value['id']=='kaggle-private-account')['state']='planned'
        policy_file=self.root/'read-only-policy.json';archive.atomic_json(policy_file,policy)
        client=archive.ArchiveClient.__new__(archive.ArchiveClient);client.config={'policyFile':str(policy_file)};client.root=self.root/'reader';client.owner='fixture-owner';client.dataset=lambda project:None
        client.download=lambda project,version,name,folder: manifest_file if name.endswith('.manifest.json') else package
        receipt={'provider':'kaggle','project':'language','dataset':client.reference('language'),'version':1,'recordId':manifest['recordId'],'packageSHA256':manifest['package']['sha256']}
        _,_,result=client.verify('language',receipt);self.assertTrue(result['verified']);self.assertEqual(result['version'],1)
        with self.assertRaisesRegex(ValueError,'disabled'):client.archive('language',self.source)

    def test_unresolved_intent_prevents_automatic_resubmission(self):
        manifest, _, _ = self.build()
        client = archive.ArchiveClient.__new__(archive.ArchiveClient)
        client.root = self.root / 'pending-client'; (client.root / 'tmp').mkdir(parents=True); client.owner='fixture-owner'
        archive.atomic_json(client.root / 'intents' / 'language' / (manifest['recordId']+'.json'), {'status':'sending'})
        client.dataset = lambda project, allow_absent=False: None
        with self.assertRaisesRegex(ValueError, 'unresolved'): client.archive('language', self.source)

if __name__ == '__main__': unittest.main()
