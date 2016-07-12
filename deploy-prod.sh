set -e
GITURL=https://github.com/gooodhub/gooodhub.github.io.git
npm install
NODE_ENV=production node index.js
cd dist
rm -rf .git/
git init
git remote add origin $GITURL
git add .
git commit -am "Deploy production"
git push origin master --force
