set -e
GITURL=https://github.com/gooodhub/goood-site-front.git
npm install
NODE_ENV=production node index.js
cd dist
rm -rf .git/
git init
git remote add origin $GITURL
git add .
git commit -am "Deploy release"
git push origin master:gh-pages --force
