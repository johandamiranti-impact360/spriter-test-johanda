file1 = open('domainlock.js')
file1_contents = file1.read()

# Inject framebreaker code
restricted_domain = 'marketjs.com' # should be https://marketjs.com, once SSL is up

framebreaker = 'if(document.referrer.indexOf(\"' + restricted_domain + '\")<0){if(top!=self){console.log(\"showing anti-piracy layer ...\");$(\"#anti-piracy\").show();top.location.replace(self.location.href);}}'
# console.log(\"document.referrer\",document.referrer);console.log(\"framebreaker test ...\");
new_code = file1_contents.replace('this.FRAMEBREAKER;',framebreaker)
file1.close()

file2 = open('domainlock.js','w')
file2.write(new_code)
file2.close()