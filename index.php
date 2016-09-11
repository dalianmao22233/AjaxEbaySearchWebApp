<?php 
//echo "=========";
error_reporting(E_ALL);
//error_reporting(0);
//header('Cache-control:private,must-revalidate');

//session_cache_limiter('private');
//session_start();
$array = array();
$jsonresults='';
$results='';
if(!empty($_GET['submit']))
{
    $endpoint = 'http://svcs.ebay.com/services/search/FindingService/v1';  // URL to call
    $responseEncoding = 'XML';   // Format of the response
    if(isset($_GET['keywords']))
    {
   // $keywords = str_replace(" ","20%",$_POST["keywords"]);
    $safeQuery = urlencode (($_GET['keywords']));
    $keywords = $_GET['keywords'];
    }
    $priceRangeMin = 0.0;
    $itemsPerRange = $_GET['ItemsPerRange'];
    $sortOrder =$_GET['sortOrder'];
    $pageNumber = $_GET['pageNumber'];
    

    
    $apicall = "$endpoint?siteid=0&OPERATION-NAME=findItemsAdvanced"
            . "&SERVICE-VERSION=1.0.0"
            . "&SECURITY-APPNAME=usca79f67-89fe-4806-a54d-d4c859336e5" //replace with your app id
            . "&RESPONSE-DATA-FORMAT=$responseEncoding"
            . "&keywords=$safeQuery"
            . "&paginationInput.entriesPerPage=$itemsPerRange"
            . "&sortOrder=$sortOrder";

    $apicall .= "&paginationInput.pageNumber=$pageNumber";
            $i=0;
            $j=0;
            $k=0;
     if(isset($_GET['Condition']))
     {
            $Condition = $_GET['Condition'];   
         //if(!empty($Condition))
         if($Condition!=null)
            {
                $t="";
                for($k=0;$k<count($Condition);$k++)
                {
                  //  echo $Condition[$k];
                    $t=$t.",".$Condition[$k];
                    $apicall .="&itemFilter($i).name=Condition"."&itemFilter($i).value($k)=$Condition[$k]";
                }
              //  echo $t;
               // echo $apicall;
                $i+=1;
            }
     }
             
          if(isset($_GET['ListingType']))  
         
          {
              
              $ListingType = $_GET['ListingType'];
              if($ListingType!=null)
            {
                $t="";
                for($k=0;$k<count($ListingType);$k++)
                {
                  //  echo $ListingType[$k];
                    $t=$t.",".$ListingType[$k];
                    $apicall .="&itemFilter($i).name=ListingType"."&itemFilter($i).value($k)=$ListingType[$k]";
                }
    
                $i+=1;
            }
          }
            if(isset($_GET['ReturnsAcceptedOnly']))
               {
                   $ReturnsAcceptedOnly = $_GET['ReturnsAcceptedOnly'];
                   if($_GET['ReturnsAcceptedOnly']=="on")
            {  
                $apicall .= "&itemFilter($i).name=ReturnsAcceptedOnly"."&itemFilter($i).value=true";
                $i+=1;
            }
               }
    
            if(isset($_GET['FreeShippingOnly']))
               {
                   $FreeShippingOnly = $_GET['FreeShippingOnly'];
               if($_GET['FreeShippingOnly']=="on")
            {
                $apicall .= "&itemFilter($i).name=FreeShippingOnly"."&itemFilter($i).value=true";
                $i+=1;
            }
               }
            if(isset($_GET['ExpeditedShippingType']))
            {
                $ExpeditedShippingType = $_GET['ExpeditedShippingType'];
                if($_GET['ExpeditedShippingType']=="on")
            {
                $apicall .= "&itemFilter($i).name=ExpeditedShippingType"."&itemFilter($i).value=Expedited";
                $i+=1;
            }
            }
        
        if(isset($_GET['MaxHandlingTime']))
        {
            $MaxHandlingTime = $_GET['MaxHandlingTime'];
            if($MaxHandlingTime!=null&&$MaxHandlingTime>=1)
        {
                $apicall .= "&itemFilter($i).name=MaxHandlingTime"."&itemFilter($i).value=$MaxHandlingTime";
                $i+=1;
        }
        }
        if(isset($_GET['max']))
        {
            $MaxPrice = $_GET['max'];
            if($MaxPrice!=""&&!preg_match("/[^0-9.]/",$MaxPrice))
            {  
            
                $apicall .= "&itemFilter($i).name=MaxPrice"."&itemFilter($i).value=$MaxPrice";
                $i+=1;
                }
        }
        if(isset($_GET['min']))
        {
            $MinPrice = $_GET['min'];
            if($MinPrice!=""&&!preg_match("/[^0-9.]/",$MinPrice))
            {
            
                $apicall .= "&itemFilter($i).name=MinPrice"."&itemFilter($i).value=$MinPrice";
                $i+=1;
        }
        
        }
    //$apicall .= "&outputSelector[0]=SellerInfo&outputSelector[1]=PictureURLSuperSize&outputSelector[2]=StoreInfo&paginationInput.pageNumber=1";
    $apicall .= "&outputSelector[0]=SellerInfo&outputSelector[1]=PictureURLSuperSize&outputSelector[2]=StoreInfo";
    
  //  echo $apicall;
    //$link='';
    
    // Load the call and capture the document returned by the Finding API
    $resp = simplexml_load_file($apicall);
    if ($resp && $resp->paginationOutput->totalEntries > 0) 
    {
        //$results .= $resp->paginationOutput->totalEntries;
        $array["ack"]="$resp->ack";
        $a=$resp->paginationOutput;
        $array["resultCount"]="$a->totalEntries";
        //total=$a->totalEntries;
        $total=$resp->paginationOutput->totalEntries;
        $array["pageNumber"]="$a->pageNumber";
        $array["itemCount"]="$a->entriesPerPage";
        $k=0;
        foreach($resp->searchResult->item as $item)
        {
         
            //if($k<$array["itemCount"])
            if($k<$total)
            { 
                if ($item->galleryURL) 
                {
                    $array["item$k"]["basicInfo"]["galleryURL"]= "$item->galleryURL";
                } 
                else 
                {
                    $array["item$k"]["basicInfo"]["galleryURL"]= "http://pics.ebaystatic.com/aw/pics/express/icons/iconPlaceholder_96x96.gif";
                }
                $array["item$k"]["basicInfo"]["viewItemURL"]="$item->viewItemURL";
               // $array["'item$k'->'basicInfo'->'viewItemURL'"]=$item->viewItemURL;
           // $array["item"]["basicInfo"]["viewItemURL"]=$item->viewItemURL;
                $array["item$k"]["basicInfo"]["title"]="$item->title";
                $array["item$k"]["basicInfo"]["pictureURLSuperSize"]="$item->pictureURLSuperSize";
                $b=$item->sellingStatus;
                $array["item$k"]["basicInfo"]["convertedCurrentPrice"]="$b->convertedCurrentPrice";
                $c=$item->condition;
                $array["item$k"]["basicInfo"]["conditionDisplayName"] = "$c->conditionDisplayName";
                $d=$item->listingInfo;
                $array["item$k"]["basicInfo"]["listingType"] = "$d->listingType";
                
                
                $printSeller = $item->returnsAccepted;
                if(isset($_GET['ReturnsAcceptedOnly']))
        {
            $ReturnsAcceptedOnly = $_GET['ReturnsAcceptedOnly'];
            if($printSeller=="true"&&$ReturnsAcceptedOnly=="on")
            {
                $array["item$k"]["shippingInfo"]["returnsAccepted"] = "true";
            }
            else
                $array["item$k"]["shippingInfo"]["returnsAccepted"] = "false";
        }
                $e=$item->shippingInfo;
                $array["item$k"]["basicInfo"]["shippingServiceCost"]= "$e->shippingServiceCost";
                $array["item$k"]["shippingInfo"]["expeditedShipping"] = "$e->expeditedShipping";
                
                 //if(isset($_GET['MaxHandlingTime']))
                //{
                  //  $MaxHandlingTime = $_GET['MaxHandlingTime'];
                    //if($MaxHandlingTime!)
                    //{  
                        $array["item$k"]["shippingInfo"]["handlingTime"] = "$e->handlingTime";
                    //}
                
                //}
                //else 
                  //  $array["item$k"]["shippingInfo"]["handlingTime"] = "$e->handlingTime";
                
                //$array["item$k"]["shippingInfo"]["handlingTime"] = "$e->handlingTime";
                $array["item$k"]["shippingInfo"]["oneDayShippingAvailable"]="$e->oneDayShippingAvailable";
                $array["item$k"]["basicInfo"]["location"] = "$item->location";
                $f=$item->primaryCategory;
                $array["item$k"]["basicInfo"]["categoryName"]="$f->categoryName";    
                $array["item$k"]["basicInfo"]["topRatedListing"] = "$item->topRatedListing";
                $g=$item->sellerInfo;
                $array["item$k"]["sellerInfo"]["sellerUserName"]="$g->sellerUserName";
                $array["item$k"]["sellerInfo"]["feedbackScore"]="$g->feedbackScore";
                $array["item$k"]["sellerInfo"]["positiveFeedbackPercent"]="$g->positiveFeedbackPercent";
                $array["item$k"]["sellerInfo"]["feedbackRatingStar"]="$g->feedbackRatingStar";
                $array["item$k"]["sellerInfo"]["topRatedSeller"]="$g->topRatedSeller";
                $h=$item->storeInfo;
                $array["item$k"]["sellerInfo"]["sellerStoreName"]="$h->storeName";
                $array["item$k"]["sellerInfo"]["sellerStoreURL"]="$h->storeURL";
                $e->shippingType=preg_replace('(\B[A-Z])',' $0',$e->shippingType);
                $array["item$k"]["shippingInfo"]["shippingType"]="$e->shippingType";
                
                
                
                $array["item$k"]["shippingInfo"]["shipToLocations"]="$e->shipToLocations";
           
               }
            $k+=1;
        }
       
    //    foreach($array as $key=>$value)
     //   {
      //      echo $key."====>".$value."<br />";
        //    print_r($array);
      //  }
        //echo str_replace("\\/","/",json_encode($array));
      
        }
    else 
    {
        //$array[""]="$resp->ack";
        $array["ack"]="No results found";
    }
    echo str_replace("\\/","/",json_encode($array));
    
}
      
   
    
?>          
