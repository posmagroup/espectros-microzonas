import os, sys
import site

prev_sys_path = list(sys.path)

site.addsitedir('/www/eros.69grados.com/env/lib/python2.7/site-packages')
sys.path.append('/www/eros.69grados.com/webapp')

# reorder sys.path so new directories from the addsitedir show up first

new_sys_path = [p for p in sys.path if p not in prev_sys_path]

for item in new_sys_path:
	sys.path.remove(item)

sys.path[:0] = new_sys_path

sys.stdout = sys.stderr

os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'

import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler()
