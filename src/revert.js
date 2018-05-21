const argv = require('yargs')
    .usage('Usage: $0 --json [json path] --dst [output path]')
    .demandOption(['json','dst'])
    .argv
const logger = require('bunyan').createLogger({
    name: 'revert',
    level: 'error'
})
const jsonPath = argv.json
const dstPath = argv.dst
const isobejct = require('isobject')
const fse = require('fs-extra')
const _ = require('lodash')

const CHILDREN_TAG = 'children'
const RESPONSE_VALUE = '负责人'
const TEXT_TAG = 'text'
const ROOT_TAG = 'root'
const PERSONS_TAG= 'persons'
const PARENT_TAG = 'parent'


const treeize = (obj, parent)=>{
    const n = {}
    n[PARENT_TAG] = parent
    let children = []
    let result = []
    if( !isobejct(obj) ){
        return []
    }
    if( TEXT_TAG in obj && obj[TEXT_TAG] === RESPONSE_VALUE ){
        children = obj[CHILDREN_TAG]
        n[PERSONS_TAG] = []
        _.each(children, (v)=>{
            if( TEXT_TAG in v ){
                n[PERSONS_TAG].push(v[TEXT_TAG])
            }
        })
        result.push( n )
    }else{
        _.each(obj, (v,k)=>{
            logger.info( `Current key is ${k}` )
            if( k === CHILDREN_TAG ){
                logger.info(`Find children`)
                children = obj[k]
                _.each(children, (v)=>{
                    logger.info(`Children size is ${children.length}`)
                    result = _.concat(result,treeize(v, n))
                })
            }
            else{
                n[ k ] = v
            }
        })
    }
    return result
}
fse.readJson(jsonPath)
    .then(obj=>{
        if( !(ROOT_TAG  in obj) ){
            logger.error(`No root in obj, obj maynot be not complete`)
            return
        }
        result = treeize( obj[ROOT_TAG] , undefined)
        logger.warn( result )
        const responsibleMapping = {}
        _.each( result, v=>{
            if( PERSONS_TAG in v ){
                const persons = v[PERSONS_TAG]
                let tags = []
                let n = v[PARENT_TAG]
                //logger.error( v )
                //logger.error( v[PARENT_TAG] )
                while( n != undefined ){
                    if( TEXT_TAG in n ){
                        tags.push( n[TEXT_TAG] )
                    }
                    n = n[PARENT_TAG]
                }
                tags = _.reverse( tags )
                //logger.error( tags )
                _.each( persons, p => {
                    if( !(p in responsibleMapping) ){
                        responsibleMapping[p] = []
                    }
                    responsibleMapping[p].push( tags)
                })
            }
        })
        //logger.error(responsibleMapping )
        return responsibleMapping
    })
    .then(mapping=>{
        const lines = []
        _.each( mapping, (v, k )=>{
            _.each(v, v1=>{
                const line = [k].concat(v1)
                lines.push(_.join(line,','))
            })
        })
        const content = _.join(lines,'\r\n')
        return fse.outputFile(dstPath,content)
    })
    .catch(e=>{
        logger.error(e)
    })
