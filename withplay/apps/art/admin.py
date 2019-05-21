from django.contrib import admin
from django_redis import get_redis_connection

from .models import Art, Banner, Advice

import json


@admin.register(Art)
class ArtAdmin(admin.ModelAdmin):
    list_display = ('oid', 'types', 'img', 'title', 'addr', 'detail', 'sdate', 'edate', 'adate')
    list_filter = ('types',)
    search_fields = ('title',)

    # def save_form(self, request, form, change):
    #     return form.save(commit=False)
    
    # def delete_queryset(self, request, queryset):
    #     for q in queryset:
    #         print(q.pk)
    #     queryset.delete()


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ('title', 'img', 'index', 'adate')

    def delete_queryset(self, request, queryset):
        con = get_redis_connection('default')
        pl = con.pipeline()
        for q in queryset:
            temp = json.dumps({'img':str(q.img)}).replace('"','\'')
            pl.lrem('banner_key', 0, temp)
        pl.execute() 
        queryset.delete()
    
    # def save_form(self, request, form, change):
    #     print(form)
    #     print(request)
    #     print(change)
        # return form.save(commit=False)
    
    # def save_model(self, request, obj, form, change):
    #     print(obj.__dict__)
    #     obj.save()


@admin.register(Advice)
class AdviceAdmin(admin.ModelAdmin):
    list_display = ('oid', 'types', 'art', 'phone', 'content', 'adate')
    list_filter = ('types',)
    search_fields = ('phone',)


admin.site.site_header = 'PlayWith'
admin.site.site_title = 'PlayWith'
