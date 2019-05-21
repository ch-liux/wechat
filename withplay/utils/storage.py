from django.conf import settings
from django.core.files.storage import Storage
from django_redis import get_redis_connection

import oss2
import uuid


class OssStorage(Storage):

    def __init__(self):
        oss = settings.AUTH_OSS
        self.auth = oss2.Auth(oss["KeyId"], oss["KeySecret"])
        self.bucket = oss2.Bucket(self.auth, oss["BucketLink"], oss["BucketName"])
    
    def _open(self, name, mode="rb"):
        pass
    
    def _save(self, name, content):
        if '\\banner\\' in name:
            pn = "withplay/banner/" + str(uuid.uuid1()) + "." + name.split(".")[1]
        elif '\\art\\' in name:
            pn = "withplay/art/" + str(uuid.uuid1()) + "." + name.split(".")[1]
        self.bucket.put_object(pn, content)

        nname = "https://weidax.oss-cn-beijing.aliyuncs.com/" + pn

        con = get_redis_connection('default')
        pl = con.pipeline()
        pl.lpush('banner_key', {"img":nname})
        pl.execute()

        return nname
    
    def exists(self, name):
        return False
    
    def url(self, name):
        return name