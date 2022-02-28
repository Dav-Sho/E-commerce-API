const fs = require('fs')
const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv')
const Product = require('./model/Product')
const mongoose = require('mongoose')

// load env var
dotenv.config({path: './config/config.env'})

mongoose.connect(process.env.MONGO_URI)

const products = JSON.parse(fs.readFileSync(`${__dirname}/_data/products.json`, 'utf-8'))

const importData = async() => {
    try {
        await Product.create(products)
        console.log('Data Imported...'.green.inverse);
        process.exit()
    } catch (err) {
       console.error(err) 
    }
}

const destoryData = async() => {
    try {
        await Product.deleteMany(products)
        console.log('Data Destoryed...'.red.inverse);   
    } catch (err) {
        console.error(err) 
    }
}

if(process.argv[2] === 'i') {
    importData()
}else if(process.argv[2] === 'd') {
    destoryData()
}