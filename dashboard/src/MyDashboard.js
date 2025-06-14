import React, { useState, useRef, useEffect } from 'react';

const enumFilters = ['אשדוד', 'בן גוריון', 'גשר אלנבי', 'טאבה', 'לא רשום', 'רפיח']; // defualt filters of default dimension TEUR_SITE

function MyDashboard() {
  const [availableCharts, setAvailableCharts] = useState([]);
  const [droppedCharts, setDroppedCharts] = useState([]);
  const [filterValue, setFilterValue] = useState(enumFilters[0]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dropZoneActive, setDropZoneActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const iframeRefs = useRef([]);


  const fetchChartsFromSAC = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // a temporary DEMO
      const chartsData = [
        {
          id: 'chart1',
          name: 'test_portal_1',
          type: 'bar',
          description: 'פילוח תנועות לפי סוגי נוסעים',
          url: 'https://piba-qa.il30.hcs.cloud.sap/sap/fpa/ui/app.html#/story2&/s2/A557D9EB3FC671CA6AD5039E942D1022/?mode=present'
        },
        {
          id: 'chart2',
          name: 'test_portal_2',
          type: 'bar',
          description: 'פילוח תנועות לפי מדינה',
          url: 'https://piba-qa.il30.hcs.cloud.sap/sap/fpa/ui/app.html#/story2&/s2/3AAF0C9B3B9DE528D232DAD04A946FE2/?mode=present'
        },
        {
          id: 'chart3',
          name: 'test_portal_3',
          type: 'bar',
          description: 'פילוח תנועות לפי סוג נוסעים',
          url: 'https://piba-qa.il30.hcs.cloud.sap/sap/fpa/ui/app.html#/story2&/s2/91E7432F4794A623FF7FD8C31B8DF96E/?mode=present'
        }
      ];

      setAvailableCharts(chartsData);

    } catch (err) {
      setError(`שגיאה בטעינת התרשימים: ${err.message}`);
      console.error('Error fetching charts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChartsFromSAC();
  }, []);


  const generateChartUrlWithFilter = (baseUrl, filter, dimension, measure) => {
    try {
      const storyId = baseUrl.split('/').pop().replace('?mode=present', '');

      const storyModels = {
        'A557D9EB3FC671CA6AD5039E942D1022': {
          model: 'view:[PIBADWH_HDI_DB_1][PIBADWH_HDI_DB_1][CV_MODEL_FCT_RASHBAG]',
          dimension: 'TEUR_SITE'
        },
        '3AAF0C9B3B9DE528D232DAD04A946FE2': {
          model: 'view:[PIBADWH_HDI_DB_1][PIBADWH_HDI_DB_1][CV_MODEL_FCT_RASHBAG]',
          dimension: 'TEUR_SITE'
        },
        '91E7432F4794A623FF7FD8C31B8DF96E': {
          model: 'view:[PIBADWH_HDI_DB_1][PIBADWH_HDI_DB_1][CV_MODEL_FCT_RASHBAG]',
          dimension: 'TEUR_SITE'
        }
      };

      const storyConfig = storyModels[storyId];
      console.log( `מודל עבור ${storyId}:`, storyConfig);

      if (!storyConfig) {
        console.warn(`לא נמצא מודל עבור : ${storyId}`);
        return baseUrl;
      }

      const filterDimension = dimension || storyConfig.dimension; // default dimension

      const filterValue = `["${measure || filter}"]`;

      const baseUrlWithoutParams = `https://piba-qa.il30.hcs.cloud.sap/sap/fpa/ui/app.html#/story2&/s2/${storyId}`;

      const filterParams = new URLSearchParams({
        f01Model: storyConfig.model,
        f01Dim: filterDimension, 
        f01Val: filterValue, 
        mode: 'present'
      });

      console.log(`יצירת URL מפולטר עבור ${filterParams.toString()}`);

      const newUrl = `${baseUrlWithoutParams}?${filterParams.toString()}`;

      console.log(`נוצר URL מפולטר עבור ${storyConfig.description}:`, newUrl);

      return newUrl;

    } catch (error) {
      console.error('שגיאה ביצירת URL מפולטר:', error);
      return baseUrl;
    }
  };


  const handleDragStart = (e, chart) => {
    setDraggedItem(chart);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', chart.id);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setIsDragging(false);
    setDropZoneActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDropZoneActive(true);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDropZoneActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const chartId = e.dataTransfer.getData('text/plain');
    const chart = availableCharts.find(c => c.id === chartId);

    if (chart && droppedCharts.length < 3) {
      const newChart = {
        ...chart,
        id: Date.now(),
        originalId: chart.id,
        currentFilter: filterValue,
        generatedUrl: generateChartUrlWithFilter(chart.url, filterValue, chart.id)
      };
      setDroppedCharts(prev => [...prev, newChart]);
    }

    setDropZoneActive(false);
    setIsDragging(false);
    setDraggedItem(null);
  };

  const addChart = (chart) => {
    if (droppedCharts.length < 3) {
      const newChart = {
        ...chart,
        id: Date.now(),
        originalId: chart.id,
        currentFilter: filterValue,
        generatedUrl: generateChartUrlWithFilter(chart.url, filterValue, chart.id)
      };
      setDroppedCharts(prev => [...prev, newChart]);
    }
  };

  const applyFilter = () => {
    setDroppedCharts(prev => prev.map(chart => ({
      ...chart,
      currentFilter: filterValue,
      generatedUrl: generateChartUrlWithFilter(
        availableCharts.find(ac => ac.id === chart.originalId)?.url || chart.url,
        filterValue,
        chart.originalId
      )
    })));

    iframeRefs.current.forEach((iframe) => {
      if (iframe && iframe.contentWindow) {
        const filterPayload = {
          type: 'setFilter',
          data: {
            dataSource: 'dummyDataSource',
            selections: [
              {
                dimension: 'Product',
                members: [filterValue],
              },
            ],
          },
        };
        iframe.contentWindow.postMessage(filterPayload, '*');
      }
    });
  };

  const exportToPDF = async () => {
    const chartsSummary = droppedCharts.map(chart =>
      `תרשים: ${chart.name} - פילטר: ${chart.currentFilter}`
    ).join('\n');

    alert(`ייצוא PDF:\n${chartsSummary}`);
  };

  const removeChart = (idToRemove) => {
    setDroppedCharts(prev => prev.filter(chart => chart.id !== idToRemove));
    iframeRefs.current = iframeRefs.current.filter((_, index) =>
      droppedCharts[index]?.id !== idToRemove
    );
  };

  const refreshCharts = () => {
    fetchChartsFromSAC();
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#3dbdff'
      }}>
        טוען תרשימים מהשרת...
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#f5f7fa',
      direction: 'rtl'
    }}>
      <header style={{
        backgroundColor: '#3dbdff',
        color: 'white',
        padding: '20px',
        textAlign: 'center',
        boxShadow: '0 2px 10px rgba(59, 221, 255, 0.3)'
      }}>
        <h2 style={{ margin: 0, fontSize: '24px' }}>הדשבורד שלי</h2>
      </header>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)' }}>
        {/* Sidebar with draggable charts */}
        <div style={{
          width: '280px',
          backgroundColor: 'white',
          padding: '20px',
          borderLeft: `3px solid #3dbdff`,
          boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <h3 style={{
              margin: 0,
              color: '#2c3e50',
            }}>
              ספריית תרשימים
            </h3>
            <button
              onClick={refreshCharts}
              style={{
                backgroundColor: '#3dbdff',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="רענן תרשימים"
            >
              {/* <FontAwesomeIcon icon={faRotateRight} /> */}
            </button>
          </div>

          <div style={{
            borderBottom: '2px solid #ecf0f1',
            paddingBottom: '15px',
            marginBottom: '15px'
          }}>
            <div style={{
              fontSize: '12px',
              color: '#7f8c8d',
              marginBottom: '5px'
            }}>
              {availableCharts.length} תרשימים זמינים
            </div>
          </div>

          {error && (
            <div style={{
              backgroundColor: '#ffe8e8',
              border: '1px solid #ff9999',
              borderRadius: '5px',
              padding: '10px',
              marginBottom: '15px',
              fontSize: '12px',
              color: '#721c24'
            }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {availableCharts.map((chart) => (
              <div
                key={chart.id}
                draggable
                onDragStart={(e) => handleDragStart(e, chart)}
                onDragEnd={handleDragEnd}
                onClick={() => addChart(chart)}
                style={{
                  backgroundColor: draggedItem?.id === chart.id ? '#3dbdff' : '#ecf0f1',
                  color: draggedItem?.id === chart.id ? 'white' : '#2c3e50',
                  padding: '12px',
                  margin: '8px 0',
                  borderRadius: '8px',
                  cursor: 'grab',
                  border: '2px solid transparent',
                  transition: 'all 0.2s ease',
                  fontSize: '13px',
                  fontWeight: '500',
                  userSelect: 'none'
                }}
                onMouseEnter={(e) => {
                  if (draggedItem?.id !== chart.id) {
                    e.target.style.backgroundColor = '#d5dbdb';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (draggedItem?.id !== chart.id) {
                    e.target.style.backgroundColor = '#ecf0f1';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                  {chart.name}
                </div>
                <div style={{
                  fontSize: '11px',
                  opacity: 0.8,
                  fontWeight: 'normal'
                }}>
                  {chart.description}
                </div>
                <div style={{
                  fontSize: '10px',
                  opacity: 0.6,
                  marginTop: '2px',
                  fontWeight: 'normal'
                }}>
                  סוג: {chart.type}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#e8f8ff',
            borderRadius: '5px',
            border: '1px solid #3dbdff',
            fontSize: '12px',
            color: '#2c3e50'
          }}>
            גרור תרשימים לשטח העבודה או לחץ עליהם (עד 3 תרשימים)
          </div>

          {droppedCharts.length >= 3 && (
            <div style={{
              marginTop: '10px',
              padding: '10px',
              backgroundColor: '#ffe8e8',
              borderRadius: '5px',
              border: '1px solid #ff9999',
              fontSize: '12px',
              color: '#721c24'
            }}>
              ⚠️ הגעת למקסימום של 3 תרשימים
            </div>
          )}
        </div>

        {/* Main workspace area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Controls above the board */}
          <div style={{
            backgroundColor: 'white',
            padding: '15px 20px',
            borderBottom: '1px solid #ecf0f1',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '15px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#2c3e50' }}>
                פילטר:
              </label>
              <select
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '5px',
                  border: '2px solid #3dbdff',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  color: '#2c3e50'
                }}
              >
                {enumFilters.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <button
                onClick={applyFilter}
                style={{
                  backgroundColor: '#3dbdff',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'background-color 0.2s',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#2bc4e8'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#3dbdff'}
              >
                החל פילטר
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                {droppedCharts.length}/3 תרשימים
              </div>
              <button
                onClick={exportToPDF}
                style={{
                  backgroundColor: '#3dbdff',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'background-color 0.2s',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#2bc4e8'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#3dbdff'}
              >
                ייצוא ל-PDF
              </button>
            </div>
          </div>

          {/* Charts workspace */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              flex: 1,
              padding: '20px',
              backgroundColor: dropZoneActive ? '#f8fdff' : 'transparent',
              minHeight: '500px',
              border: dropZoneActive ? `3px dashed #3dbdff` : '3px dashed transparent',
              borderRadius: '10px',
              transition: 'all 0.2s ease'
            }}
          >
            {droppedCharts.length === 0 ? (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '400px',
                border: '3px dashed #bdc3c7',
                borderRadius: '10px',
                backgroundColor: dropZoneActive ? '#e8f8ff' : 'white',
                color: '#7f8c8d',
                fontSize: '18px',
                textAlign: 'center',
                transition: 'all 0.2s ease'
              }}>
                {dropZoneActive ? 'שחרר כאן!' : '⬅ גרור עד שלושה תרשימים לשטח העבודה או לחץ עליהם'}
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: droppedCharts.length === 1 ? '1fr' :
                  droppedCharts.length === 2 ? '1fr 1fr' :
                    '1fr 1fr 1fr',
                gap: '20px',
                height: 'fit-content'
              }}>
                {droppedCharts.map((chart, index) => (
                  <div
                    key={chart.id}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '10px',
                      padding: '15px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      border: '1px solid #ecf0f1',
                      position: 'relative',
                      animation: 'slideIn 0.3s ease-out',
                      minHeight: '400px'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '15px',
                      borderBottom: '2px solid #ecf0f1',
                      paddingBottom: '10px'
                    }}>
                      <div>
                        <h4 style={{
                          margin: 0,
                          color: '#2c3e50',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}>
                          {chart.name}
                        </h4>
                        <div style={{
                          fontSize: '11px',
                          color: '#7f8c8d',
                          marginTop: '2px'
                        }}>
                          פילטר: {chart.currentFilter}
                        </div>
                      </div>
                      <button
                        onClick={() => removeChart(chart.id)}
                        style={{
                          backgroundColor: '#ff6b6b',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '22px',
                          height: '22px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#ff5252'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#ff6b6b'}
                        title="הסר תרשים"
                      >
                        ×
                      </button>
                    </div>
                    <iframe
                      ref={(el) => iframeRefs.current[index] = el}
                      src={chart.generatedUrl}
                      title={chart.name}
                      width="100%"
                      height="320px"
                      frameBorder="0"
                      style={{
                        borderRadius: '5px',
                        backgroundColor: '#f8f9fa'
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}

export default MyDashboard;