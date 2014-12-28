import sys
from iptcinfo import IPTCInfo

if(len(sys.argv) < 4):
    print "too few arguments"
    exit(1)

filename = sys.argv[1]
titlearg = sys.argv[2]
captionarg = sys.argv[3]
print "Setting IPTC Metadata for: " + filename

info = IPTCInfo(filename, force=True)
info.data['object name'] = titlearg
info.data['caption/abstract'] = captionarg

info.save()
