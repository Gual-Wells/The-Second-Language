"""Numeric-only provider inventory fixtures; no network or real credentials."""
from __future__ import annotations
import importlib.util, json, pathlib, subprocess, sys, tempfile, unittest
sys.dont_write_bytecode=True
ROOT=pathlib.Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('series_provider_inventory',ROOT/'scripts/lib/series-provider-inventory.py');module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
PROJECTS=module.PROJECTS;AT=1793460000000
HF={'owner':'fixture-owner','buckets':{p:'series-'+p for p in PROJECTS}}
def rows():return [{'id':'fixture-owner/series-'+p,'type':'bucket','visibility':'private','storage':i+1} for i,p in enumerate(PROJECTS)]
def kaggle():return {'provider':'kaggle','privateLatestBytes':20,'projects':[{'project':p,'present':True,'private':True,'latestBytes':i+1} for i,p in enumerate(PROJECTS)]}
class InventoryFixtures(unittest.TestCase):
 def test_hf_consumes_complete_paginated_iterable_and_emits_numeric_fields_only(self):
  consumed=[]
  def paginated():
   for row in rows()+[{'id':'fixture-owner/unrelated','type':'dataset','visibility':'private','storage':11},{'id':'fixture-owner/public','type':'model','visibility':'public','storage':999}]:consumed.append(1);yield row
  result=module.hf_report(paginated(),HF,AT)
  self.assertEqual(len(consumed),6);self.assertEqual(result['usedBytes'],21);self.assertEqual(result['otherUsedBytes'],11);self.assertTrue(result['complete']);self.assertIsNone(result['remainingBytes']);self.assertIsNone(result['limitBytes']);self.assertEqual(set(result['projectAttributedBytes']),set(PROJECTS));self.assertNotIn('fixture-owner',json.dumps(result));self.assertNotIn('unrelated',json.dumps(result))
 def test_hf_zero_is_verified_only_when_provider_measured_zero(self):
  values=rows();values[0]['storage']=0;result=module.hf_report(values,HF,AT);self.assertEqual(result['projectAttributedBytes']['language'],0)
  result=module.hf_report([],HF,AT);self.assertEqual(result['usedBytes'],0);self.assertIsNone(result['projectAttributedBytes']['language']);self.assertIsNone(result['otherUsedBytes'])
 def test_hf_unknown_negative_float_boolean_or_missing_sizes_are_rejected(self):
  for value in [None,-1,1.5,True,2**53]:
   values=rows();values[0]['storage']=value
   with self.assertRaises(ValueError):module.hf_report(values,HF,AT)
 def test_hf_duplicate_pagination_or_foreign_owner_does_not_double_count(self):
  values=rows()
  with self.assertRaises(ValueError):module.hf_report(values+[values[0]],HF,AT)
  values[0]['id']='other-owner/series-language'
  with self.assertRaises(ValueError):module.hf_report(values,HF,AT)
 def test_hf_expected_bucket_must_stay_private_and_have_expected_resource_type(self):
  for key,value in [('visibility','public'),('type','dataset')]:
   values=rows();values[0][key]=value
   with self.assertRaises(ValueError):module.hf_report(values,HF,AT)
 def test_kaggle_latest_private_is_explicitly_incomplete_without_fake_remaining(self):
  result=module.kaggle_report(kaggle(),AT);self.assertEqual(result['usedBytes'],20);self.assertEqual(result['otherUsedBytes'],10);self.assertFalse(result['complete']);self.assertEqual(result['measurement'],'inventory');self.assertIsNone(result['limitBytes']);self.assertIsNone(result['remainingBytes'])
 def test_kaggle_absent_unknown_and_public_boundaries(self):
  value=kaggle();value['projects'][0].update(present=False,private=None,latestBytes=None);self.assertIsNone(module.kaggle_report(value,AT)['projectAttributedBytes']['language'])
  value=kaggle();value['projects'][0]['private']=False
  with self.assertRaises(ValueError):module.kaggle_report(value,AT)
  value=kaggle();value['projects'][0]['latestBytes']=None
  with self.assertRaises(ValueError):module.kaggle_report(value,AT)
 def test_failure_has_no_numeric_guess_or_provider_error_payload(self):
  value=module.failure('hf',AT);self.assertEqual(set(value),{'resourceId','revision','observedAt','verified'});self.assertFalse(value['verified'])
 def test_cli_suppresses_sdk_body_token_and_file_list_and_preserves_per_provider_failure(self):
  parent=ROOT/'.cache/series-provider-inventory/tests';parent.mkdir(parents=True,exist_ok=True)
  with tempfile.TemporaryDirectory(dir=parent) as temporary:
   temp=pathlib.Path(temporary);sdk=temp/'sdk';(sdk/'huggingface_hub').mkdir(parents=True);(sdk/'huggingface_hub/__init__.py').write_text("__version__='2.4.0'\nclass HfApi:\n def __init__(self,**kw):pass\n def whoami(self):raise RuntimeError('RAW_HTTP_BODY_DO_NOT_DISCLOSE fake_secret_DO_NOT_DISCLOSE private_file_list_DO_NOT_DISCLOSE')\n")
   token=temp/'token.txt';token.write_text('fake_secret_DO_NOT_DISCLOSE')
   config={'providerInventory':{'dataDirectory':str(temp/'runtime'),'hf':{**HF,'sdkDirectory':str(sdk),'sdkVersion':'2.4.0','tokenFile':str(token)},'kaggle':{'sdkDirectory':str(temp/'not-installed')}}};config_file=temp/'config.json';config_file.write_text(json.dumps(config));output=temp/'numeric.json'
   run=subprocess.run([sys.executable,str(ROOT/'scripts/lib/series-provider-inventory.py'),'--config',str(config_file),'--output',str(output)],capture_output=True,text=True,timeout=15)
   self.assertEqual(run.returncode,0);result=json.loads(output.read_text());self.assertEqual(set(result),{'reports'});self.assertEqual(len(result['reports']),2);self.assertTrue(all(not row['verified'] for row in result['reports']))
   combined=run.stdout+run.stderr+output.read_text();self.assertNotIn('DO_NOT_DISCLOSE',combined);self.assertNotIn('RuntimeError',combined);self.assertNotIn('traceback',combined.lower())
if __name__=='__main__':unittest.main()
