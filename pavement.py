import paver
from paver.easy import *

options(
    server="brentfitzgerald.com",
    username="burnto",
    path="~/brentfitzgerald.com/bf10",
)

@task
def deploy():
    """Build Paver's documentation and install it into paver/docs"""
    
    cmd = "scp -r web/* %s@%s:%s/" % (options.username, 
                                       options.server, 
                                       options.path)
    sh(cmd)
    # print cmd
    # paver.ssh.scp(source, dest)
    