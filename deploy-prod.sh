echo "!!!!!!!!! Déploiement en PROD !!!!!!!!!" 
echo "Etes-vous sûr(e) ? tapez OUI[ENTRÉE]: " 
read confirm
if test "$confirm" = "OUI"
then
    echo "Ok, c'est parti alors."
else
    echo "Ah, j'ai bien fait de vérifier alors. On arrête tout.'"
    exit -1
fi
echo "Entrez le descriptif des changements et tapez [ENTRÉE]: " 
read commitmsg
if test "$commitmsg" = ""
then
    echo "Le message de commit ne peut pas être vide. Arrêt."
    exit -1
fi
set -e
GITURL=https://github.com/gooodhub/goood-site-prod.git
if [ -d "./dist" ]
then
rm -rf dist
fi
git clone -b gh-pages --single-branch $GITURL dist
cd dist
#git checkout gh-pages
mv .git ../gitdeploy
cd ..
npm install
NODE_ENV=production node index.js
cd dist
mv CNAME.PROD CNAME
rm CNAME.BETA
mv ../gitdeploy ./.git
git add .
git commit -am "$commitmsg"
git push --force 
cd ..