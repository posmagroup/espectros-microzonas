from django.conf.urls import patterns, include, url

from apps.index.views import IndexView
from apps.microzonificacion.views import MicrozoneDetail

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'espectros_microzonas.views.home', name='home'),
    # url(r'^espectros_microzonas/', include('espectros_microzonas.foo.urls')),
    
    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),

    url(r'^$', IndexView.as_view() ),
    url(r'^json$', MicrozoneDetail.as_view()),
    
)
