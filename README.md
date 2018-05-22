# revertTree
Input: 
```
    export file from http://my-mind.github.io/
```
Output:
``` 
    csv file from the view of persons who take charge of project
```
Usage:
```
    webpacked version:
    node webpacked/findResponsibility.js --json [json path, for example, test/Projects.mymind] --dst [output path, for example, test/Projects.xls]
    
    non-webpacked version:
    npm i 
    node src/revert.js --json [json path, for example, test/Projects.mymind] --dst [output path, for example, test/Projects.xls]
```
