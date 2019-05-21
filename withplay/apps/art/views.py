from django.views import View
from django.http import HttpResponse
from django.core.cache import cache
from django_redis import get_redis_connection

from .models import Art, Banner, Advice
from .serializers import ArtSerializers, BannerSerializers, AdviceSerializers, PaginationSerializers

from rest_framework import viewsets, filters, mixins
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
import json
import demjson
import time


class ArtView(viewsets.ModelViewSet):

    # 指定结果集并设置排序
    queryset = Art.objects.filter(isdel=0).order_by('-pk')
    # 指定序列化的类
    serializer_class = ArtSerializers
    # 指定分页配置
    pagination_class = PaginationSerializers
    #配置搜索功能
    filter_backends = (DjangoFilterBackend, filters.SearchFilter, )
    filter_fields = ('oid', 'types', 'isdel')
    #设置搜索的关键字,=表示全匹配
    search_fields = ('title', 'addr', 'detail')
    #设置搜索出的结果中需要排序的字段
    ordering_field = ('adate', 'sdate')

    def create(self, request, *args, **kwargs):
        d = dict(request.data)
        if not all([d['oid'], d['index'], d['title'], d['addr'], d['desc'], d['sdate'], d['edate']]):
            return Response("empty")
        art = Art()
        art.oid = d['oid']
        art.types = d['index']
        art.img = ','.join(d['img'])
        art.title = d['title']
        art.addr = d['addr']
        art.detail = d['desc']
        art.sdate = d['sdate']
        art.edate = d['edate']
        art.adate = time.strftime("%Y-%m-%d %H:%M")
        art.save()
        return Response("ok")
    
    def retrieve(self, request, *args, **kwargs):
        art = self.queryset.get(pk=kwargs['pk'])
        params = request.query_params.dict()
        serializer = ArtSerializers(art)

        if params.get('oid'):
            # 保存浏览记录
            con = get_redis_connection('default')
            pl = con.pipeline()
            browse_key = 'browse_%s' % params['oid']
            # 去重
            pl.lrem(browse_key, 0, kwargs['pk'])
            pl.lpush(browse_key, kwargs['pk'])
            pl.execute()
        return Response(serializer.data)
    
    def update(self, request, *args, **kwargs):
        params = request.query_params.dict()
        if params.get('oid'):
            art = self.queryset.get(pk=kwargs['pk'], oid=params['oid'])
        else:
            art = self.queryset.get(pk=kwargs['pk'])
        art.isdel = 1
        art.save()
        return Response({"result":"ok"})


class BannerView(viewsets.ReadOnlyModelViewSet):

    # 指定结果集并设置排序
    queryset = Banner.objects.all().order_by('-index')
    # 指定序列化的类
    serializer_class = BannerSerializers

    def list(self, request, *args, **kwargs):
        con = get_redis_connection('default')
        banners = con.lrange('banner_key', 0, 5)
        
        if len(banners) == 0:
            serializers = []
            for q in self.queryset:
                serializers.append(BannerSerializers(q).data)
            banners = serializers
        else:
            temp = []
            for banner in banners:
                temp.append(demjson.decode(banner))
            banners = temp
        return Response(banners)



class AdviceView(viewsets.GenericViewSet, mixins.CreateModelMixin):

    # 指定结果集并设置排序
    queryset = Advice.objects.all().order_by('-pk')
    # 指定序列化的类
    serializer_class = AdviceSerializers


class BrowseView(View):

    def get(self, request):
        oid = request.GET.get('oid','')
        con = get_redis_connection('default')
        pl = con.pipeline()
        browse_key = 'browse_%s' % oid

        art_ids = con.lrange(browse_key, 0, 13)
        arts = []
        for art_id in art_ids:
            art = Art.objects.get(pk=int(art_id))
            serializer = ArtSerializers(art)
            arts.append(serializer.data)
        return HttpResponse(json.dumps(arts, ensure_ascii=False),content_type="application/json,charset=utf-8")
