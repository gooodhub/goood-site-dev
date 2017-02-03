import $ from 'jquery';
import Chart from 'chartjs';

var ctx = $("#repartition-methodologie");
var data = {
    labels: [
        "Pratique",
        "Théorie",
    ],
    datasets: [
        {
            data: [60, 40],
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
var myPieChart = new Chart(ctx,{
    type: 'pie',
    data: data,
        options: {
              scales: {
                fontSize: 18
              }
    }
});
