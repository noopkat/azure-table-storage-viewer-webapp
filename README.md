# azure-table-storage-viewer-webapp

A quick app for viewing the most recent rows in an Azure Table Storage instance from a webpage.  
You can fork and deploy your own version of this to use if you'd find it useful.

[![Deploy to Azure](https://azuredeploy.net/deploybutton.svg)](https://azuredeploy.net/)

## How to deploy

Firstly, **fork this repo and use your new fork to deploy**

You have two options for deploying this:
1. Create a new Web App in Azure and select your fork as the Quick Deployment source. Then add the application settings manually (see below).
2. Click on the 'Deploy to Azure' button and fill out the required fields and application settings before clicking 'deploy'. Gets you live, fast.

### Application Settings you'll need

1. `AZURE_TABLE_STORAGE_ACCOUNT` - the name you gave your Storage Account instance the Table is in
2. `AZURE_TABLE_STORAGE_KEY` - either `key1` or `key2` from your Access Policies of your Storage Account
3. `AZURE_TABLE_NAME` - the name of your Azure Storage Table
4. `TABLE_COLUMNS` - a comma separated list of names of the columns you want to appear, eg. `Timestamp, first_name, last_name, age`

## What it looks like

Here's a sample app screenshot:

![example screenshot of a data table on a webpage](http://i.imgur.com/4IlCJtM.png)

## Defaults

If you use the 'Deploy to Azure' button, this app deploys on App Service pricing tier `F1`, which is free.

Out of the box, this app will show you the last 100 rows. However, you can tweak this number by adding a `rows` query parameter to the app url, ie `?rows=15` for example. 

Rows sort on Timestamp. There is no pagination. Lean app right here! Gets the job done, nothing more.