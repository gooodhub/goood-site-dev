echo "!!!!!!!!! Déploiement en PROD !!!!!!!!!" 
echo "Etes-vous sûr(e) ? tapez OUI[ENTRÉE]: " 
read commitmsg
if test "$commitmsg" = "OUI"
then
    echo "Ok, c'est parti alors."
else
    echo "Ah, j'ai bien fait de vérifier alors. On arrête tout.'"
    exit -1
fi
set -e
GITURL=https://github.com/gooodhub/gooodhub.github.io.git
npm install
NODE_ENV=production node index.js
cd dist
mv CNAME.PROD CNAME
rm CNAME.BETA
rm -rf .git/
git init
git remote add origin $GITURL
git add .
git commit -am "Deploy production"
git push origin master --force
