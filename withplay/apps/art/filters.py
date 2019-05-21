import django_filters
from .models import Art


"""自定义过滤器"""
class ArtFilter(django_filters.rest_framework.FilterSet):

    oid = django_filters.CharField(max_length=50, verbose_name="用户id")
    types = django_filters.IntegerField(choices=((1, "游戏"), (2, "旅游"), (3, "唱歌"), (4, "其它")), default=1, verbose_name="类型")
    isdel = django_filters.IntegerField(choices=((1, "删除"),(0, "正常")), default=0, verbose_name="是否删除", null=True, blank=True)

    class Meta:
        model = Art
        fields = ['oid', 'types', 'isdel']
