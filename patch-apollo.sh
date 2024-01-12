#!/bin/sh

# original source: https://github.com/apollographql/apollo-client/issues/8218

if [[ -f "./node_modules/@apollo/client/package.json.bak" ]]; then
  exit 0
fi

sed -i.bak "s/\"dependencies\":/\"exports\":{\".\":{\"node\":\".\/main.cjs.js\",\"default\":\".\/index.js\"},\".\/cache\":{\"node\":\".\/cache\/cache.cjs.js\",\"default\":\".\/cache\/index.js\"},\".\/core\":{\"node\":\".\/core\/core.cjs.js\",\"default\":\".\/core\/index.js\"},\".\/link\/schema\":{\"node\":\".\/link\/schema\/schema.cjs.js\",\"default\":\".\/link\/schema\/index.js\"},\".\/link\/context\":{\"node\":\".\/link\/context\/context.cjs.js\",\"default\":\".\/link\/context\/index.js\"},\".\/link\/http\":{\"node\":\".\/link\/http\/http.cjs.js\",\"default\":\".\/link\/http\/index.js\"}},\n\"dependencies\":/" node_modules/@apollo/client/package.json