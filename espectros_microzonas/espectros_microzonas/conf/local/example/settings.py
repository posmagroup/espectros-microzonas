# -*- coding: utf-8 -*-

#from webapp.webapp import settings
from django.conf import settings
import os


DEBUG = True

GEOSERVER_URL = "http:192.200.214.201:8080/geoserver/microzonas/wms/"

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(settings.VAR_ROOT, '69grados.com.db'),
    }
}


if DEBUG:
    # Show emails in the console during developement.
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
