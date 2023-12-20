import ReactDOM from 'react-dom/client';
//新版需加/client
import 'semantic-ui-css/semantic.min.css'

import App from './App'

// ReactDOM.render(<App/>,document.getElementById('root'));
//新版不支援此寫法

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);