//var pageNo = 8;
$(document).ready(function () {
    
        jQuery.validator.addMethod("isMin", function (value, element) {
            var minnum = /^[-+]?[0-9]+(\.[0-9]+)?$/;
return this.optional(element) || (minnum.test(value));
});
        jQuery.validator.addMethod("isMax", function (value, element) {
            var maxnum = /^[-+]?[0-9]+(\.[0-9]+)?$/;
return this.optional(element) || (maxnum.test(value));
});
        
        jQuery.validator.addMethod("isMin_negative", function (value, element) {
return this.optional(element) || (value>=0);
});
        jQuery.validator.addMethod("isMax_negative", function (value, element) {
            if($("#min").val()!="")
            {
                if(Number($("#min").val())<Number($("#max").val()))
                return this.optional(element) || (value>=0);
            }
            else 
                return this.optional(element) || (value>=0);
});
        jQuery.validator.addMethod("istime", function (value, element) {
            var time = /^[-+]?\d+$/;
return this.optional(element) || (time.test(value));
});
        jQuery.validator.addMethod("istime_negative", function (value, element) {
return this.optional(element) || (value>=1);
});  
  
  
$('#search_form').validate({   
            errorElement : 'span',
            errorClass : 'help-block',
            focusInvalid : false,
            rules : {
                keywords : {
                    required : true
                },
                min : {
                    isMin : true,
                    isMin_negative : true
                },
                max : {
                    isMax : true,
                    isMax_negative : true 
                },
                MaxHandlingTime : {
                    istime : true,
                    istime_negative : true
                }
            },
            messages : {
                keywords : {
                    required : "<b>Please enter a key word</b>"
                },
                min : {
                    isMin : "<b>Price should be a valid number</b>",
                    isMin_negative : "<b>Minimum price cannot be below 0</b>"
                },
                max :{
                    isMax : "<b>Price should be a valid number</b>",
                    isMax_negative : "<b>Maximum price cannot be less than minimum price or below 0</b>"
                },
                MaxHandlingTime : {
                    istime : "<b>Max handling time should be a valid digit</b>",
                    istime_negative : "<b>Max handling time should be greater than or equal to 1</b>"
                }
            },
    
    
            submitHandler: function(form) {
               // form.submit();
              getform(1);
                
    
            
            },

            highlight : function(element) {
                $(element).closest('.form-group').addClass('has-error');
            },

            success : function(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement : function(error, element) {
                element.parent('div').append(error);
            } 
});   


  
});

function getform(page)
{

                var pagemod=page%5;
                var page1=page-pagemod+1;
                var page2=page-pagemod+2;
                var page3=page-pagemod+3;
                var page4=page-pagemod+4;
                var page5=page-pagemod+5;
                
                data_php = $('#search_form').serialize()+'&pageNumber='+page+'&submit=search';
                $.ajax({
                        url: 'http://scf.usc.edu/~yuxinshi/ebay/index.php',
                        type: 'GET',
                        data: data_php,
                        success: function(response) {
                           // $(data).filter('#phpform').html();
                          //  $('#phpform').html(response);
                          //  var obj=JSON.parse(response);
                           
                        
               
               
                        
                            var obj=JSON.parse(response);
                            if(obj.resultCount>0)
                            {
                            var resultHTML="<div class='page-header'><h3>";
                            if((obj.pageNumber*obj.itemCount)<=obj.resultCount)
                            resultHTML+=((obj.pageNumber-1)*obj.itemCount+1)+"-"+(obj.pageNumber*obj.itemCount)+" items out of ";
                            else
                            resultHTML+=((obj.pageNumber-1)*obj.itemCount+1)+"-"+obj.resultCount+" items out of ";
                            resultHTML+=obj.resultCount+"</h3></div>";
                            var i=0;
                            var pageCount=Math.ceil(obj.resultCount/obj.itemCount);
                            //$('.article img').addClass('carousel-inner img-responsive img-rounded');
                            //var result="";
                       // resultHTML+="<code> $('.article img').addClass('carousel-inner img-responsive img-rounded');  <code>";
                                
                          //   resultHTML+=obj.resultCount;   
                        var itemNum=0;        
                        if((obj.resultCount-(obj.pageNumber-1)*obj.itemCount) >= obj.itemCount)
                        {
                            itemNum = obj.itemCount;
                        }else
                        {
                            itemNum = obj.resultCount - (obj.pageNumber-1)*obj.itemCount;
                        }
                           for(i=0;i<itemNum;i++)
                            //    while(i<obj.resultCount)
                            {
                            
                                
                            resultHTML+="<div class='media'><div class='media-left'><a href='#mymodal"+i+"' data-toggle='modal'><img class='media-object' src='"+obj["item"+i]["basicInfo"]["galleryURL"]+"' height='100' width='100'></a></div>";
                                resultHTML+="<div class='media-body'><h4 class='media-heading'><a href='"+obj["item"+i]["basicInfo"]["viewItemURL"]+"'>"+obj["item"+i]["basicInfo"]["title"]+"</a><br /></h4><b>Price:$"+obj["item"+i]["basicInfo"]["convertedCurrentPrice"]+"</b>(";
                                if(obj["item"+i]["basicInfo"]["shippingServiceCost"]!=null&&obj["item"+i]["basicInfo"]["shippingServiceCost"]>0.0)
                                    resultHTML+="+$"+obj["item"+i]["basicInfo"]["shippingServiceCost"]+")";
                                else 
                                    resultHTML+="FREE Shipping)";
                                resultHTML+="    <i>Location:"+obj["item"+i]["basicInfo"]["location"]+"</i>";
                                if(obj["item"+i]["basicInfo"]["topRatedListing"]=="true")
                                    resultHTML+="<img src='itemTopRated.jpg' width='30' height='30'>";
                                else
                                    resultHTML+="";
                               
                                resultHTML+="<a href='#"+i+"' data-toggle='collapse'>View Details</a><img src='fb.png' width='15' height='15' onClick='fb"+i+"()'>";
                                
                                
                                //facebook apicall !!!!!
            resultHTML+="<script>function fb"+i+"() {FB.ui({method: 'feed',link: '"+obj["item"+i]["basicInfo"]["viewItemURL"]+"',caption: 'Search Information from eBay.com',description:'Price:$"+obj["item"+i]["basicInfo"]["convertedCurrentPrice"]+"(";
                                
                               if(obj["item"+i]["basicInfo"]["shippingServiceCost"]!=null&&obj["item"+i]["basicInfo"]["shippingServiceCost"]>0.0)
                                   resultHTML+="+$"+obj["item"+i]["basicInfo"]["shippingServiceCost"];
                                else
                                    resultHTML+="FREE Shipping";
                                
                                resultHTML+=") Location:"+obj["item"+i]["basicInfo"]["location"]+"',source:'"+obj["item"+i]["basicInfo"]["galleryURL"]+"',name:'"+obj["item"+i]["basicInfo"]["title"]+"' }, function(response){if (response && !response.error_code) {alert('Posted Successfully');} else {alert('Not Posted');}});}</script>";                       
                                
                                //facebook end!!!!!
                                
                                
                               
                                
                                resultHTML+="<div id='"+i+"' class='collapse'><ul class='nav nav-tabs'><li><a href='#basic"+i+"' data-toggle='tab'>Basic Info</a></li><li><a href='#seller"+i+"' data-toggle='tab'>Seller Info</a></li><li><a href='#shipping"+i+"' data-toggle='tab'>Shipping Info</a></li></ul>";
                                resultHTML+="<div class='tab-content'><div class='tab-pane' id='basic"+i+"'><div class='row'><div class='col-md-4'><b>Category Name</b></div><div class='col-md-4'>  "+obj["item"+i]["basicInfo"]["categoryName"]+"</div></div><div class='row'><div class='col-md-4'><b>Condition</b></div><div class='col-md-4'>   "+obj["item"+i]["basicInfo"]["conditionDisplayName"]+"</div></div><div class='row'><div class='col-md-4'><b>Buying format</b></div><div class='col-md-4'>  "+obj["item"+i]["basicInfo"]["listingType"]+"</div></div></div><div class='tab-pane' id='seller"+i+"'><div class='row'><div class='col-md-4'><b>User name</b></div><div class='col-md-4'>  "+obj["item"+i]["sellerInfo"]["sellerUserName"]+"</div></div><div class='row'><div class='col-md-4'><b>Feedback score</b></div><div class='col-md-4'>";
                                
                                resultHTML+=obj["item"+i]["sellerInfo"]["feedbackScore"];
                                resultHTML+="</div></div><div class='row'><div class='col-md-4'><b>Positive feedback</b></div><div class='col-md-4'>  "+obj["item"+i]["sellerInfo"]["positiveFeedbackPercent"]+"</div></div><div class='row'><div class='col-md-4'><b>Feedback rating</b></div><div class='col-md-4'>   "+obj["item"+i]["sellerInfo"]["feedbackRatingStar"]+"</div></div>";
                                resultHTML+="<div class='row'><div class='col-md-4'><b>Top rated</b></div><div class='col-md-4'>   ";
                                if(obj["item"+i]["sellerInfo"]["topRatedSeller"]=="true")
                                resultHTML+="<span id=green class='glyphicon glyphicon-ok' aria-hidden='true'></span></div></div>";
                                else
                                    resultHTML+="<span id=red class='glyphicon glyphicon-remove' aria-hidden='true'></span></div></div>";
                                resultHTML+="<div class='row'><div class='col-md-4'><b>Store</b></div><div class='col-md-4'>   ";
                                if(obj["item"+i]["sellerInfo"]["sellerStoreName"])
                                    resultHTML+="<a href='"+obj["item"+i]["sellerInfo"]["sellerStoreURL"]+"'>"+obj["item"+i]["sellerInfo"]["sellerStoreName"]+"</a></div></div>";
                                    //resultHTML+="======================="; 
                                else
                                    //resultHTML+="=======================";
                            //resultHTML+="+++++++++";
                                    //resultHTML+="<a href='"+obj["item"+i]["sellerInfo"]["sellerStoreURL"]+"'>"+obj["item"+i]["sellerInfo"]["sellerStoreName"]+"</a>";
                            
                                    resultHTML+="N/A</div></div>";
                                resultHTML+="</div><div class='tab-pane' id='shipping"+i+"'><div class='row'><div class='col-md-4'><b>Shipping type</b></div><div class='col-md-4'>  "+obj["item"+i]["shippingInfo"]["shippingType"]+"</div></div><div class='row'><div class='col-md-4'><b>Handling time</b></div><div class='col-md-4'>"+obj["item"+i]["shippingInfo"]["handlingTime"]+" day(s)</div></div><div class='row'><div class='col-md-4'><b>Shipping locations</b></div><div class='col-md-4'>  "+obj["item"+i]["shippingInfo"]["shipToLocations"]+"</div></div><div class='row'><div class='col-md-4'><b>Expedited</b></div><div class='col-md-4'>  ";
                                if(obj["item"+i]["shippingInfo"]["expeditedShipping"]=="true")
                                    resultHTML+="<span id=green class='glyphicon glyphicon-ok' aria-hidden='true'></span>";
                                else
                                    resultHTML+="<span id=red class='glyphicon glyphicon-remove' aria-hidden='true'></span>";
                                
                                resultHTML+="</div></div><div class='row'><div class='col-md-4'><b>One day shipping</b></div><div class='col-md-4'>   ";
                                if(obj["item"+i]["shippingInfo"]["oneDayShippingAvailable"]=="true")
                                    resultHTML+="<span id=green class='glyphicon glyphicon-ok' aria-hidden='true'></span>";
                                else
                                    resultHTML+="<span id=red class='glyphicon glyphicon-remove' aria-hidden='true'></span>";                                           
                                resultHTML+="</div></div><div class='row'><div class='col-md-4'><b>Returns accepted</b></div><div class='col-md-4'>  ";
                                if(obj["item"+i]["shippingInfo"]["returnsAccepted"]=="true")
                                    resultHTML+="<span id=green class='glyphicon glyphicon-ok' aria-hidden='true'></span>";
                                else
                                    resultHTML+="<span id=red class='glyphicon glyphicon-remove' aria-hidden='true'></span>";            
                                resultHTML+="</div></div></div></div></div></div></div>";
                                
            resultHTML+="<div id='mymodal"+i+"' class='modal fade'>";
            resultHTML+="<div class='modal-dialog'>";
            resultHTML+="<div class='modal-content'>";
            resultHTML+="<div class='modal-header'>";
            resultHTML+="<button type='button' class='close' data-dismiss='modal' aria-hidden='true'>x</button>";
            resultHTML+="<h3>"+obj["item"+i]["basicInfo"]["title"]+"</h3>";
            resultHTML+="</div><div class='modal-body'><div align=center '><img src='"+obj["item"+i]["basicInfo"]["pictureURLSuperSize"]+"' class='img-responsive' alt='Responsive image'></div></div></div></div></div>";
                                
                                //resultHTML+="<div class='media'>+++++++++++</div></div></div>";
                                //$('#phpform').append(obj["item"+i]["basicInfo"]["galleryURL"]);
                                //alert(getType(response));
                                //$('#phpform').html(obj.item);
                             
                           //     resultHTML+=obj["item"+i]["sellerInfo"]["feedbackScore"];
                               // resultHTML+=obj["item"+i]["sellerInfo"]["positiveFeedbackPercent"];
                                
                            }
                            //resultHTML+="<a onClick='getform("+page+")'>"+page+"</a>";
                            //resultHTML+="<a onClick='getform("+(++page)+")'>"+(++page)+"</a>";
                                
    resultHTML+="<nav>"+"<ul class='pagination pagination-lg'>";
            
    if(page==1)       
    resultHTML+="<li><a aria-label='Previous' class='disabled'><span aria-hidden='true'>&laquo;</span></a></li>";
    else
    resultHTML+="<li><a aria-label='Previous' onClick='getform("+(page-1)+")'><span aria-hidden='true'>&laquo;</span></a></li>";
  //  page1--;
    
    //else
    //resultHTML+="<li><a aria-label='Previous')><span aria-hidden='true'>&laquo;</span></a></li>";
    
    
    
    
                                
    if(page==page1)
                resultHTML+="<li class='active'><a onClick='getform("+page1+")'>"+page1+"</a></li>"; 
    else
            resultHTML+="<li><a onClick='getform("+page1+")'>"+page1+"</a></li>";
     
    if(page2<pageCount)
    {
    if(page==page2)                            
                resultHTML+="<li class='active'><a onClick='getform("+page2+")'>"+page2+"</a></li>";    
    else
                resultHTML+="<li><a onClick='getform("+page2+")'>"+page2+"</a></li>"; 
    }
    else
        resultHTML += '<li><a>N/A</a></li>';
  //  else resultHTML+="<li><a>N/A</a></li>";
    if(page3<pageCount)
    {
    if(page==page3)
                resultHTML+="<li class='active'><a onClick='getform("+page3+")'>"+page3+"</a></li>"; 
    else
                resultHTML+="<li><a onClick='getform("+page3+")'>"+page3+"</a></li>"; 
    }
    else
        resultHTML += '<li><a>N/A</a></li>';
    if(page4<pageCount)
    {
    if(page==page4)
                resultHTML+="<li class='active'><a onClick='getform("+page4+")'>"+page4+"</a></li>"; 
    else
                resultHTML+="<li><a onClick='getform("+page4+")'>"+page4+"</a></li>";
    }
    else
        resultHTML += '<li><a>N/A</a></li>';
    if(page5<pageCount)
    {
    if(page==page5)
                resultHTML+="<li class='active'><a onClick='getform("+page5+")'>"+page5+"</a></li>";     
    else
                resultHTML+="<li><a onClick='getform("+page5+")'>"+page5+"</a></li>";  
    }
    else
        resultHTML += '<li><a>N/A</a></li>';
                resultHTML+="<li><a aria-label='Next' onClick='getform("+(page+1)+")'><span aria-hidden='true'>&raquo;</span></a></li></ul></nav>";

                                
                                
                                
                            }
                            else resultHTML="<h1>"+obj.ack+"</h1>";
                            
                            $('#phpform').html(resultHTML);

                            }
                        
        });
}