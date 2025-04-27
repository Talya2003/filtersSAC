import React, { useState, useRef, useEffect } from 'react';
import './MyDashboard.css';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const chartTypes = [
    { id: 'BDAE63DB7638245C442E8573ECE1FC62', label: 'test_3' }, 
    { id: 'F3696576161D527ECEC5C32A4DF859B0', label: 'test_4' }, 
];

const enumFilters = ['country', 'sum'];

function MyDashboard() {
    const [droppedCharts, setDroppedCharts] = useState([]);
    const [filterValue, setFilterValue] = useState(enumFilters[0]);
    const iframeRefs = useRef({}); 

    const handleDrop = (result) => {
        if (!result.destination) return;
        const type = result.draggableId;
        if (droppedCharts.length >= 3) return;

        setDroppedCharts(prev => [...prev, { id: Date.now(), type }]);
    };

    const applyFilter = () => {
        Object.keys(iframeRefs.current).forEach(key => {
            const iframe = iframeRefs.current[key];
            if (iframe && iframe.contentWindow) {
                const filterPayload = {
                    type: 'setFilter',
                    data: {
                        dataSource: key, 
                        selections: [
                            {
                                dimension: 'sum', 
                                members: [filterValue], 
                            },
                        ],
                    },
                };
                iframe.contentWindow.postMessage(filterPayload, '*');
            }
        });
    };

    useEffect(() => {
        if (droppedCharts.length > 0) {
            applyFilter();
        }
    }, [filterValue, droppedCharts]);

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
                                <h3>ספריית תרשימים</h3>
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
                                    droppedCharts.map(({ id, type }) => (
                                        <div key={id} className="chart-box">
                                            <h4>{type} - {filterValue}</h4>
                                            <iframe
                                                ref={(el) => iframeRefs.current[type] = el}
                                                src={`https://piba-qa.il30.hcs.cloud.sap/sap/fpa/ui/app.html#/story2&/s2/${type}/?mode=embed`}
                                                title={type}
                                                width="100%"
                                                height="300"
                                                frameBorder="0"
                                            />
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </Droppable>
                </div>
            </DragDropContext>
        </div>
    );
}

export default MyDashboard;