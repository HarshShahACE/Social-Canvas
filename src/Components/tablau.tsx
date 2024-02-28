import React, { useEffect } from 'react';

// Define tableau property on Window interface
declare global {
  interface Window {
    tableau: any; // You can replace 'any' with a more specific type if available
  }
}

const TableauViz: React.FC = () => {
  useEffect(() => {
    const loadTableauScript = (): Promise<void> => {
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://public.tableau.com/javascripts/api/tableau-2.9.2.min.js';
        script.onload = () => resolve(); // Explicitly annotate the type of the event handler
        script.onerror = () => reject(); // Explicitly annotate the type of the event handler
        document.body.appendChild(script);
      });
    };

    const initViz = async () => {
      try {
        await loadTableauScript();

        const vizUrl = 'https://public.tableau.com/views/Connections_17065088351950/Dashboard1?:language=en&:display_count=y&:origin=viz_share_link';
        const vizContainer = document.getElementById('vizContainer');
        const options = {
          hideTabs: true,
          hideToolbar: true,
          onFirstInteractive: () => {
            console.log('Tableau viz has loaded.');
          },
        };

        // Initialize the Tableau Viz object directly
        if (window.tableau && window.tableau.Viz) {
          new window.tableau.Viz(vizContainer, vizUrl, options);
        } else {
          console.error('Tableau JavaScript API not available');
        }
      } catch (error) {
        console.error('Error loading Tableau JavaScript API:', error);
      }
    };

    initViz();

    // Clean up function
    return () => {
      // You may want to clean up resources here if needed
    };
  }, []); // Empty dependency array ensures this effect runs only once

  return <div id="vizContainer" style={{ width: '1000px', height: '760px', background: 'rgba(255,255,255,0.8)' }} />; // Adjust dimensions and styles as needed
};

export default TableauViz;
