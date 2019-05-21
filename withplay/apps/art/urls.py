from django.conf.urls import include, url
from django.urls import path
from rest_framework import routers
from rest_framework_swagger.views import get_swagger_view
from .views import ArtView, BannerView, AdviceView, BrowseView
 
#
schema_view = get_swagger_view(title='Interface API')
# 定义路由地址
route = routers.SimpleRouter()
# route = routers.DefaultRouter()
 
# 注册新的路由地址
route.register('banner', BannerView)
route.register('art', ArtView)
route.register('advice', AdviceView)
 
# 注册上一级的路由地址并添加
urlpatterns = [
    url('api/', include(route.urls)),
    url(r'^$', schema_view),
    path('browse/', BrowseView.as_view())
]
