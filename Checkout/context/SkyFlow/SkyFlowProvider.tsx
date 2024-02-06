import { SkyflowElements } from 'skyflow-react-js'
import { PaymentDetails } from '../../containers/PaymentDetails'
import { skyFlowconfig } from './config'

const SkyFlowProvider: React.FC = () => (
  <SkyflowElements config={skyFlowconfig}>
    <PaymentDetails />
  </SkyflowElements>
)

export default SkyFlowProvider
