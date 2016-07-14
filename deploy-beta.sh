set -e
GITURL=https://github.com/gooodhub/goood-site-dev.git
npm install
NODE_ENV=production node index.js
cd dist
rm -rf .git/
cp ../CNAME .
git init
git remote add origin $GITURL
git add .
git commit -am "Deploiement en béta"
git push origin master:gh-pages --force
