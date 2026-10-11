"""Small private input; any server-side weight copy must match the authorized official SHA."""
import importlib.util,pathlib,json,shutil,datetime
ROOT=pathlib.Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('control',ROOT/'run-kaggle.py');control=importlib.util.module_from_spec(spec);spec.loader.exec_module(control)
from kaggle.api.kaggle_api_extended import KaggleApi
api=KaggleApi();api.authenticate()
source=ROOT/'inputs'/'dragon-authorized-20261011';target=ROOT/'inputs'/'dragon-art-input-20261011'
receipt=ROOT/'outputs'/'art-input-transfer.json'
if receipt.exists():raise RuntimeError('Transfer intent exists; inspect server before repeating')
target.mkdir(exist_ok=True)
for file in source.rglob('*'):
    if file.is_file() and file.name not in ['model.safetensors','dataset-metadata.json']:
        dest=target/file.relative_to(source);dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(file,dest)
dataset=api.get_config_value('username')+'/dragon-art-input-20261011'
metadata={'id':dataset,'title':'Dragon licensed reference input 20261011','licenses':[{'name':'other'}],'description':'Private reference artwork and original Meta DINOv3 license/config/official checksum. The approved licensee will use a server-side weight copy only if its full SHA256 equals the original authorized download. No credentials.'}
(target/'dataset-metadata.json').write_text(json.dumps(metadata,indent=2))
control.save(receipt.name,{'stage':'uploading','dataset':dataset,'created_at':datetime.datetime.now(datetime.timezone.utc).isoformat()})
result=api.dataset_create_new(str(target),public=False,quiet=True,convert_to_csv=False,dir_mode='zip')
control.save(receipt.name,{'stage':'submitted','dataset':dataset,'response':str(result)});print(control.safe(result))
