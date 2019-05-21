from rest_framework import serializers
from rest_framework.pagination import PageNumberPagination

from .models import Art, Banner, Advice
 

class ArtSerializers(serializers.ModelSerializer):

    sdate = serializers.DateTimeField(format="%Y-%m-%d %H:%M", required=False, read_only=True)
    edate = serializers.DateTimeField(format="%Y-%m-%d %H:%M", required=False, read_only=True)
    adate = serializers.DateTimeField(format="%Y-%m-%d %H:%M", required=False, read_only=True)

    class Meta:
        model = Art     
        fields = ('pk', 'types', 'img', 'title', 'addr', 'detail', 'sdate', 'edate', 'adate', 'oid')


class BannerSerializers(serializers.ModelSerializer):

    class Meta:
        model = Banner     
        fields = ('pk', 'title', 'img', 'index', 'adate')


class AdviceSerializers(serializers.ModelSerializer):

    class Meta:
        model = Advice
        fields = ('pk', 'oid', 'types', 'art', 'phone', 'content', 'adate')


class PaginationSerializers(PageNumberPagination):
    page_size = 5
    max_page_size = 20
    page_size_query_param = 'size'
    page_query_param = 'page'
    