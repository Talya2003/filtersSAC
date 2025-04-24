import React, { useState, useRef } from 'react';
import './MyDashboard.css';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const chartTypes = [
    { id: 'bar', label: 'Bar Chart' },
    { id: 'pie', label: 'Pie Chart' },
    { id: 'line', label: 'Line Chart' },
];

const enumFilters = ['Sales', 'Marketing', 'Finance'];


function MyDashboard() {
    const [droppedCharts, setDroppedCharts] = useState([]);
    const [filterValue, setFilterValue] = useState(enumFilters[0]);

    const handleDrop = (result) => {
        if (!result.destination) return;
        const type = result.draggableId;
        if (droppedCharts.length >= 3) return;

        setDroppedCharts(prev => [...prev, { id: Date.now(), type }]);
    };

    const renderSACChart = (type, id) => (
        <div key={id} className="chart-box">
            <h4>{type} - {filterValue}</h4>
            <iframe
                src={`https://sac-view.com/${type}?filter=${filterValue}`}
                title={type}
                width="100%"
                height="250"
                frameBorder="0"
            />
        </div>
    );

    // const fetchSACChartData = async (type, filter) => {
    //   const url = `https://sac-instance.com/api/charts/${type}?filter=${filter}`;

    //   const response = await axios.get(url, {
    //     headers: {
    //       'Authorization': `Bearer ${yourToken}`, 
    //     },
    //   });

    //   return response.data; 
    // };

    // useEffect(() => {
    //     droppedCharts.forEach(async (chart) => {
    //       const data = await fetchSACChartData(chart.type, filterValue);
    //         // Update the chart with the fetched data
    //     });
    //   }, [droppedCharts, filterValue]);  


    const chartRefs = useRef([]);

    const exportToPDF = () => {
        const input = document.querySelector('.workspace');

        const doc = new jsPDF();
        
        doc.setFont('Helvetica'); 
        doc.setFontSize(16);
        doc.text("דשבורד — ייצוא PDF", 10, 10);

        const chartsSummary = droppedCharts.map(chart => (
            `גרף: ${chart.type} - פילטר: ${filterValue}`
        )).join('\n');

        doc.setFontSize(12);
        doc.text(chartsSummary, 10, 20);

        const renderChartsToPDF = async () => {
            let yOffset = 40;

            for (let i = 0; i < droppedCharts.length; i++) {
                const chart = droppedCharts[i];
                const chartElement = chartRefs.current[i];

                if (!chartElement) continue;

                const canvas = await html2canvas(chartElement);
                const imgData = canvas.toDataURL('image/png');

                doc.addImage(imgData, 'PNG', 10, yOffset, 180, 100);
                yOffset += 110;

                if (yOffset > 270) {
                    doc.addPage();
                    yOffset = 20;
                }

            }

            doc.save('dashboard.pdf');
        };

        renderChartsToPDF();
    };

    return (
        <div className="dashboard-wrapper">
            <header className="dashboard-header">
                <h2>הדשבורד שלי</h2>
                <select value={filterValue} onChange={(e) => setFilterValue(e.target.value)}>
                    {enumFilters.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            </header>

            <DragDropContext onDragEnd={handleDrop}>
                <div className="dashboard-content">
                    <Droppable droppableId="chart-library" isDropDisabled>
                        {(provided) => (
                            <div
                                className="sidebar-dashboard"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                <h3> ספריית תרשימים</h3>
                                {chartTypes.map((chart, index) => (
                                    <Draggable draggableId={chart.id} index={index} key={chart.id}>
                                        {(provided) => (
                                            <div
                                                className="chart-button"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                {chart.label}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>


                    <Droppable droppableId="workspace">
                        {(provided) => (
                            <div className="workspace" ref={provided.innerRef}>
                                {droppedCharts.length === 0 ? (
                                    <p className="placeholder-text">⬅ גרור עד שלושה תרשימים לשטח העבודה</p>
                                ) : (
                                    droppedCharts.map(({ id, type }, index) => (
                                        <div key={id} id={`chart-${id}`} ref={(el) => chartRefs.current[index] = el} className="chart-box">
                                            <h4>{type} - {filterValue}</h4>
                                            <iframe src={`https://sac-view.com/${type}?filter=${filterValue}`} title={type} width="100%" height="250" frameBorder="0" />
                                        </div>
                                    ))

                                )}
                            </div>
                        )}
                    </Droppable >

                </div >

            </DragDropContext >

            <button onClick={exportToPDF} className="export-btn">📄 ייצוא ל-PDF</button>
        </div >
    );
}

export default MyDashboard;
