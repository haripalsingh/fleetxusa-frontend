import { getCategories } from '@/lib/catalog';
import ShopByCategoryView from './ShopByCategoryView';

// Build-time list for the static HTML; the view refreshes it from the API in the browser.
const ShopByCategory = async () => <ShopByCategoryView initial={await getCategories()} />;

export default ShopByCategory;
