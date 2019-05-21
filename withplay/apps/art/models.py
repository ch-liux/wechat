from django.db import models


class Art(models.Model):
    oid = models.CharField(max_length=50, verbose_name="用户id")
    types = models.IntegerField(choices=((0, "游戏"), (1, "旅游"), (2, "唱歌"), (3, "其它")), default=1, verbose_name="类型")
    img = models.ImageField(upload_to="images/art/%Y/%m", max_length=222, verbose_name="图像")
    title = models.CharField(max_length=20, verbose_name="标题")
    addr = models.CharField(max_length=30, verbose_name="地址")
    detail = models.CharField(max_length=200, verbose_name="详情")
    sdate = models.DateTimeField(verbose_name="开始时间")
    edate = models.DateTimeField(verbose_name="结束时间")
    isdel = models.IntegerField(choices=((1, "删除"),(0, "正常")), default=0, verbose_name="是否删除", null=True, blank=True)
    adate = models.DateTimeField(auto_now=True, verbose_name="添加时间")

    class Meta:
        db_table = 'wp_art'
        verbose_name = "列表"
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.title


class Banner(models.Model):
    title = models.CharField(max_length=30, verbose_name="标题")
    img = models.ImageField(upload_to="images/banner/%Y/%m", max_length=120, verbose_name="轮播图片")
    index = models.IntegerField(default=1, verbose_name="顺序")
    adate = models.DateField(auto_now=True, verbose_name="添加时间")

    class Meta:
        db_table = 'wp_banner'
        verbose_name = "轮播图"
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.title


class Advice(models.Model):
    oid = models.CharField(max_length=50, verbose_name="用户id")
    types = models.IntegerField(choices=((1, "举报"), (0, "反馈")), default=0, verbose_name="类型")
    art = models.IntegerField(default=0, verbose_name="列表id")
    phone = models.CharField(max_length=11, verbose_name="电话")
    content = models.CharField(max_length=120, verbose_name="内容")
    adate = models.DateField(auto_now=True, verbose_name="添加时间")

    class Meta:
        db_table = 'wp_advice'
        verbose_name = "反馈建议"
        verbose_name_plural = verbose_name
