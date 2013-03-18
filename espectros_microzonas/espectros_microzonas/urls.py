# -*- coding: utf-8 -*-

from django.conf.urls import patterns, include, url
from apps.index.views import IndexView
from apps.microzonificacion.views import MicrozoneDetail
from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', IndexView.as_view() ),
    url(r'^getmicrozone/', MicrozoneDetail.as_view(), name='microzone'),
    (r'^admin/', include(admin.site.urls)),
)
