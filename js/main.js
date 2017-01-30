
$(function(){
//------------------------------------------------------Model-----------------------------------------------------------
    var model={
        userInput:{
            //Default settings
            price:570,
            model:"M3WH",
            gender:'male',
            gears:3,
            color:'white',
            helmet:false,
            busket:false,
            saddle:false,
            lights:false,
            city:'Helsinki',
            name:'user'
        },
        getUserData:function () {
            return this.userInput;
        },
        changeAttrValue:function (attr,val) {
            this.userInput[attr]=val;
            this.userInput.price=this.calculatePrice();
            this.userInput.model=this.changeModelName();
        },
        changeModelName:function () {
            return (this.userInput.gender[0]+this.userInput.gears+this.userInput.color.substr(0,2)).toUpperCase();
        },
        calculatePrice:function () {
            var newPrice=450;
            newPrice+=(this.userInput.gender=="male")?30:40;
            newPrice+=(this.userInput.gears==3)?20:(this.userInput.gears==6)?70:120;
            newPrice+=(this.userInput.color=="white")?20:(this.userInput.color=="blue"||this.userInput.color=="pink")?30:40;
            if(this.userInput.helmet==true){newPrice+=10};
            if(this.userInput.busket==true){newPrice+=15};
            if(this.userInput.saddle==true){newPrice+=55};
            if(this.userInput.lights==true){newPrice+=25};
            var city=this.userInput.city;
            newPrice+=(city=="Helsinki")?50:(city=="London"||city=="Paris")?100:150;
            return newPrice;
        },
        checkBoxChanged:function(attr){
            var res=(this.userInput[attr]) ? this.userInput[attr]=false : this.userInput[attr]=true;
            this.userInput.price=this.calculatePrice();
        }


    };
//------------------------------------------------------View------------------------------------------------------------
    var view={
        init: function() {

            this.$textPrice=$('#textPrice');
            this.$textModel=$('#textModel');
            this.$inputName=$('#inputName');
            this.$btnOrder=$('#btnOrder');
            this.$btnConfirm=$('#btnConfirm');
            this.$helpMsg=$('#helpMsg');

            var btnAttributes=[
                ["gender","male"],["gender","female"],
                ["gears",3],["gears",6],["gears",9],
                ["color","white"],["color","blue"], ["color","pink"], ["color","beige"], ["color","silver"], ["color","gold"]
            ];
            var cbAttributes=[
                "helmet","busket","saddle","lights"
            ]

            var buttons = [
                this.$btnMale=$('#btnMale'),this.$btnFemale=$('#btnFemale'),
                this.$btnGears3=$('#btnGears3'), this.$btnGears6=$('#btnGears6'), this.$btnGears9=$('#btnGears9'),
                this.$btnWhite=$('#btnWhite'), this.$btnBlue=$('#btnBlue'), this.$btnPink=$('#btnPink'),
                    this.$btnBeige=$('#btnBeige'), this.$btnSilver=$('#btnSilver'), this.$btnGold=$('#btnGold')
            ];

            var checkBoxes=[
                this.$cbHelmte=$('#cbHelmet'), this.$cbBusket=$('#cbBusket'), this.$cbSaddle=$('#cbSaddle'),
                    this.$cbLights=$('#cbLights')
            ];

            $(".selectMenu li").click(function(e){
                controller.changeUserInput("city",e.currentTarget.innerText);

            });

            //adding listeners for buttons
            for (var i=0;i<btnAttributes.length;i++){
                buttons[i].click((function (numCopy) {
                    return function () {
                        controller.changeUserInput(btnAttributes[numCopy][0],btnAttributes[numCopy][1]);
                    };

                })(i));
            };
            //adding listeners for checkboxes
            for (var i=0;i<cbAttributes.length;i++){

                checkBoxes[i].click((function (numCopy) {

                    return function () {
                        controller.checkBoxClicked(cbAttributes[numCopy]);
                    };

                })(i));
            };

            //adding listeners for confirm and order button
            this.$btnOrder.click(function(){
               controller.openCloseForm("order");

            });

            this.$btnConfirm.click(function(){
                if(controller.checkInputFields()){
                    var name=controller.getUserName();
                    controller.changeUserInput("name",name);
                    controller.sendOrderToServer();
                    controller.openCloseForm("confirm");
                }

            });
            this.render();
        },
        changeVisitility:function (str) {
            if(str=="order"){
                this.$inputName.show();
                this.$btnConfirm.show();
                this.$btnOrder.hide();
                this.$helpMsg.show();
            }
            if(str=="confirm"){
                this.$inputName.hide();
                this.$btnConfirm.hide();
                this.$btnOrder.show();
                this.$helpMsg.hide();
            }

        },
        returnUserName:function () {
            return this.$inputName.val();
        },
        inputFieldStatus:function () {

            return (this.$inputName.val().length>4)?true:false;
        },
        render:function () {
            var user=controller.getUserInfo();
            this.$textPrice.text(user.price+'$');
            this.$textModel.text("BikeX model "+user.model);

            //at first we remove hightlight from all buttons
            $("button").removeClass("active");
            //then we add hightlight to those that we chosen
            if(user.gender=="male") {
                $('#btnMale').addClass("active");
                $('#imgBike').attr("src","img/bikem.jpg");

            }else{
                $('#btnFemale').addClass("active");
                $('#imgBike').attr("src","img/bikef.jpg");

            }
            var btnGearsActive=(user.gears==3) ? "#btnGears3" : (user.gears==6) ? "#btnGears6":"#btnGears9";
            var btnColorActive=(user.color=="white") ? "#btnWhite" : (user.color=="blue") ? "#btnBlue":
                                    (user.color=="pink")? "#btnPink": (user.color=="beige") ? "#btnBeige":
                                        (user.color=="silver")? "#btnSilver":"#btnGold";

            $(btnGearsActive).addClass("active");
            $(btnColorActive).addClass("active");


            $("#btnSelect").text(user.city+"  ");
            $(' <span class="caret"></span>').appendTo("#btnSelect");

            console.log(user);

            
        }
    };
//------------------------------------------------------Controller------------------------------------------------------
    var controller={
        init: function() {
            view.init();
            this.getOrdersFromServer();
        },
        getUserInfo:function () {
            return model.getUserData();
        },
        changeUserInput:function (attrName,value) {
            model.changeAttrValue(attrName,value);
            view.render();
        },
        openCloseForm:function (str) {
            view.changeVisitility(str);
        },
        sendOrderToServer:function () {
            var user=this.getUserInfo();

            var accessories='';
            accessories+=(user.helmet==true)?"helmet":'';
            accessories+=(user.busket==true)?"busket":'';
            accessories+=(user.saddle==true)?"saddle":'';
            accessories+=(user.lights==true)?"lights":'';
            var orderInfo = "q="+user.name.replace(/\s/g, '/')+"+"+user.model+"+"+user.price+"+"+user.city.replace(/\s/g, '')+"+"+accessories;
            var xmlRequest = $.ajax({
                url: "http://users.metropolia.fi/~alexanza/php/testConnection.php",
                data: orderInfo
            });
           this.getOrdersFromServer();
        },
        getOrdersFromServer:function () {
            $.ajax({
                type: 'post',
                url: 'http://users.metropolia.fi/~alexanza/php/getData.php',
                success: function(d){
                    $('.orderRows').remove();
                    var orders=jQuery.parseJSON(d);
                    for(var i=0;i<orders.length;i++){

                        $("#tableOrders").append("<tr class='orderRows'> <td>"+orders[i].userName+
                                                "</td> <td>"+orders[i].model+
                                                "</td> <td>"+orders[i].price+
                                                " $</td> <td>"+orders[i].city+
                                                "</td> </tr>");
                    }
                }
            });

        },
        checkInputFields:function () {
            return view.inputFieldStatus();
        },
        getUserName:function () {
            return view.returnUserName();
        },
        checkBoxClicked:function (attrName) {
            model.checkBoxChanged(attrName);
            view.render();
        }
    };
    controller.init();
    //controller.getOrdersFromServer();

}());







