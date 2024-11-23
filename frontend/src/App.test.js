import { render } from '@testing-library/react';
import App from './App';
//import { ShopContext } from '../../Context/ShopContext'
import ShopContextProvider from './Context/ShopContext';

test('renders learn react link', () => {
  //const {getTotalCartItems, getTotalCartAmount, all_product, cartItems, addToCart, removeFromCart} = useContext(ShopContext);
  render(<ShopContextProvider>
    <App/>
  </ShopContextProvider>);
  //const linkElement = screen.getByText(/learn react/i);
  //expect(linkElement).toBeInTheDocument();
});
