require("dotenv").config();
require("../config/database").connect();
const express = require("express");
const Product = require("../model/product");
const app = express();


app.post('/',async (req,res)=>{
    try 
    {
        const { name, brand, category,productId } = req.body;
        const oldProduct = await Product.findOne({ productId });

        if (oldProduct) {
        return res.status(409).send("Product Id Already Exist. Please Give Different Id");
        }
        const product = await Product.create({
        name,
        brand,
        category,
        productId
        });
        res.status(201).json(product);
    }catch (err) {
    console.log(err);
  }  
});
//User post instead of get,just to make sure none of the user will be able to see the values with url
app.post('/find',async (req,res)=>{
    try 
    {
        // const { name, brand, category } = req.body;
   
        let product=await Product.find({}).lean;
        if(!!product){
            res.status(201).json(product);
        }
        else{
            res.status(404).send("No Product Available");
        }
        
    }catch (err) {
    console.log(err);
  }  
});
//Just to demonstrate get
app.get('/findByProductId',async (req,res)=>{
    try 
    {
        const productId=req.body.productId;
        //console.log(name);
        let product=await Product.findOne({},{productId:productId});
        if(!!product){
            res.status(201).json(product);
        }
        else{
            res.status(404).send("Requested Product is not Available");
        }
    }catch (err) {
    console.log(err);
  }  
});
//To  demonstrate put or update
app.put('/updateById/:id',async (req,res)=>{
    try 
    {
        const id=req.params.id;
        const { name, brand, category,productId } = req.body;
        // console.log(id);
        let product=await Product.findOne({},{_id:id});
        if(!!product){
            await Product.updateOne({_id:id},{$set:{
                name:name,
                brand:brand,
                category:category,
                productId:productId
            }
            });
            res.status(200).json("Updated Product Successfiully");
        }
        else{
            res.status(404).send("Requested Product is not Available");
        }
    }catch (err) {
    console.log(err);
  }  
});
//To  demonstrate patch or update one filed
app.patch('/updateNameByProductId',async (req,res)=>{
    try 
    {
        const id=req.query.productId;
        const { name } = req.body;
        console.log(id);
        let product=await Product.findOne({},{productId:id});
        if(!!product){
            await Product.updateOne({productId:id},{$set:{
                name:name
            }
            });
            res.status(200).json("Updated Product Name Successfiully");
        }
        else{
            res.status(404).send("Requested Product is not Available to Change");
        }
    }catch (err) {
    console.log(err);
  }  
});

app.delete('/deleteByProductId',async (req,res)=>{
    try 
    {
        const id=req.body.productId;
        console.log(id);
        let product=await Product.findOne({},{productId:id});
        if(!!product){
            await Product.deleteOne({productId:id});
            res.status(200).json("Product Deleted Successfiully");
        }
        else{
            res.status(404).send("Product is not Available to delete");
        }
    }catch (err) {
    console.log(err);
  }  
});

//To  demonstrate patch or update one filed

module.exports = app;
