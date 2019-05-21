
from django.contrib import admin
from django.views.static import serve
from django.urls import path, include, re_path
from withplay import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('apps.art.urls')),
    re_path('^media/(?P<path>.*)', serve, {"document_root": settings.MEDIA_ROOT})
]
