const squel = require("squel");

// generate select query
const select = (table, columns, where) => {
    const query = squel.select()
    query.from(table)
    query.field(columns)
    if (where) {
        query.where(where)
    }
    return query.toString()
}


// console.log( select("users", "*") )


/*
NOTE: All methods prefixed with '_' are internal and not exposed via the
query builder.
 */

class CreateTableBlock extends squel.cls.Block {
    /** The method exposed by the query builder */
    table(name) {
        this._name = name;
    }

    /** The method which generates the output */
    _toParamString(options) {
        return {
            text: this._name,
            values: [],  /* values for paramterized queries */
        };
    }
}

class CreateFieldBlock extends squel.cls.Block {
    constructor(options) {
        super(options);
        this._fields = [{name: 'id', type: 'INT PRIMARY KEY  NOT NULL AUTO_INCREMENT'}];
    }

    /** The method exposed by the query builder */
    field(name, type) {
        this._fields.push({
            name: name, type: type
        });
    }

    /** The method which generates the output */
    _toParamString(options) {

        let str = this._fields.map((f) => {
            return `${f.name} ${f.type.toUpperCase()}`;
        }).join(', ');

        return {
            text: `(${str})`,
            values: [],   /* values for paramterized queries */
        };
    }
}

class CreateTableQuery extends squel.cls.QueryBuilder {
    constructor(options, blocks) {
        super(options, blocks || [
            new squel.cls.StringBlock(options, 'CREATE TABLE'),
            new CreateTableBlock(options),
            new CreateFieldBlock(options),
        ]);
    }
}


/** Convenience method */
squel.create = function (options) {
    return new CreateTableQuery(options);
};

/* Try it out! */

console.log(

);



const createTable = (table, columns=[], userControl = true) => {
    const query = squel.create().table(table)

    columns.map(col=>{
        query.field(col.name, col.type)
    })
    if(userControl){
        query.field('created_id', 'INT')
        query.field('updated_id', 'INT')
    }

    query.field('created_at', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP')
    query.field('updated_at', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')

    return query.toString()

}

console.log(createTable("users", [{name: 'name', type: 'VARCHAR(255)'}, {name: 'email', type: 'VARCHAR(255)'}]))