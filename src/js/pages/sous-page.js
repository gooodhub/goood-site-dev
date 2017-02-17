import $ from 'jquery';
import Chart from 'chartjs';

var ctx = $("#repartition-methodologie");
var pourcentagePratique = $("#pourcentagePratique").html();
if(pourcentagePratique != undefined){
    var pourcentageTheorie = 100 - pourcentagePratique;
    var data = {
        labels: [
            "Pratique",
            "Théorie",
        ],
        datasets: [
            {
                data: [pourcentagePratique, pourcentageTheorie],
                backgroundColor: [
                    "#fc4c02",
                    "#1d3f51",
                ],
                hoverBackgroundColor: [
                    "#fc4c02",
                    "#1d3f51",
                ]
            }]
        };
    Chart.defaults.global.defaultFontSize=14;

    var myPieChart = new Chart(ctx,{
        type: 'pie',
        data: data,
            options: {
        }
    });
}

