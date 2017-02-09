
echo "########## Mise à jour de la version ##########" 
GITURL=https://github.com/gooodhub/goood-site-dev.git
git clone -b master --single-branch $GITURL dist
git checkout master
# ls -a | grep -v '^\.$' | grep -v '^\.\.$' | grep -v '^\.git$' | xargs rm -rf
npm patch version

echo "########## Configuration du repo ##########" 
TARGET_BRANCH="master"
SSH_REPO='git@github.com:gooodhub/goood-site-dev.git'

echo "########## Configuration du compte git pour commit ##########" 
git config user.email "cedric.burceaux@gmail.com"
git config user.name "nrgy"

echo "########## Chiffrement des données ##########"
openssl aes-256-cbc -K $encrypted_65e126d10998_key -iv $encrypted_65e126d10998_iv -in deploy_key.enc -out deploy_key -d
chmod 600 deploy_key
eval "$(ssh-agent)"
ssh-add deploy_key

echo "########## Push des modifications ##########" 
git push $SSH_REPO $TARGET_BRANCH --force && git push $SSH_REPO $TARGET_BRANCH --tags
