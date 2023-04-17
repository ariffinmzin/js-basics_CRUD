var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display books page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM cars ORDER BY id desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/books/index.ejs
            res.render('cars',{data:''});   
        } else {
            // render to views/books/index.ejs
            res.render('cars',{data:rows});
        }
    });
});

// display add book page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('cars/add', {
        brand: '',
        model: ''        
    })
})

// add a new book
router.post('/add', function(req, res, next) {    

    let brand = req.body.brand;
    let model = req.body.model;
    let errors = false;

    if(brand.length === 0 || model.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name and author");
        // render to add.ejs with flash message
        res.render('cars/add', {
            brand: brand,
            model: model
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            brand: brand,
            model: model
        }
        
        // insert query
        dbConn.query('INSERT INTO cars SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('cars/add', {
                    brand: form_data.brand,
                    model: form_data.model                    
                })
            } else {                
                req.flash('success', 'Car successfully added');
                res.redirect('/cars');
            }
        })
    }
})

// display edit book page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM cars WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Car not found with id = ' + id)
            res.redirect('/cars')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('cars/edit', {
                title: 'Edit Car', 
                id: rows[0].id,
                brand: rows[0].brand,
                model: rows[0].model
            })
        }
    })
})

// update book data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let brand = req.body.brand;
    let model = req.body.model;
    let errors = false;

    if(brand.length === 0 || model.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter brand and model");
        // render to add.ejs with flash message
        res.render('cars/edit', {
            id: req.params.id,
            brand: brand,
            model: model
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            brand: brand,
            model: model
        }
        // update query
        dbConn.query('UPDATE cars SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('cars/edit', {
                    id: req.params.id,
                    brand: form_data.brand,
                    model: form_data.model
                })
            } else {
                req.flash('success', 'Car successfully updated');
                res.redirect('/cars');
            }
        })
    }
})
   
// delete book
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM cars WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to books page
            res.redirect('/cars')
        } else {
            // set flash message
            req.flash('success', 'Car successfully deleted! ID = ' + id)
            // redirect to books page
            res.redirect('/cars')
        }
    })
})

module.exports = router;