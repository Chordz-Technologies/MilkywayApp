import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Animated,
  Easing,

} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MILK_PRODUCTS = [
  {
    id: '1',
    name: 'Farm Fresh Milk',
    desc: 'Pure, creamy cow milk for your daily nutrition.',
    price: 55,
    image: 'https://images.unsplash.com/photo-1519864600265-c3eded6dfa0c?auto=format&fit=crop&w=400&q=80',
    discount: 10, // in percent
    inStock: true,
  },
  {
    id: '2',
    name: 'Artisan Paneer',
    desc: 'Soft cottage cheese made fresh every day.',
    price: 260,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    discount: 0,
    inStock: false,
  },
  {
    id: '3',
    name: 'Homemade Ghee',
    desc: 'Traditional ghee rich in taste and aroma.',
    price: 600,
    image: 'https://images.unsplash.com/photo-1603297632226-2e3a6f8f0bce?auto=format&fit=crop&w=400&q=80',
    discount: 5,
    inStock: true,
  },
  {
    id: '4',
    name: 'Classic Dahi',
    desc: 'Thick, natural curd—perfect for all dishes.',
    price: 45,
    image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=400&q=80',
    discount: 0,
    inStock: true,
  },
  {
    id: '5',
    name: 'White Butter',
    desc: 'Delicate, smooth, homemade white butter.',
    price: 180,
    image: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&w=400&q=80',
    discount: 12,
    inStock: true,
  },
];

type Product = typeof MILK_PRODUCTS[0];
type CartItem = Product & { quantity: number };


const MilkProductsList = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [addAnim] = useState(new Animated.Value(0));
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const found = prev.find(item => item.id === product.id);
      if (found) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
    setLastAdded(product.id);
    Animated.sequence([
      Animated.timing(addAnim, { toValue: 1, useNativeDriver: true, duration: 250, easing: Easing.out(Easing.cubic) }),
      Animated.timing(addAnim, { toValue: 0, useNativeDriver: true, duration: 250, easing: Easing.in(Easing.cubic) }),
    ]).start();
  };

  const buyNow = (product: Product) => {
    Alert.alert(
      'Buy Now',
      `Thank you for choosing "${product.name}". We'll contact you for delivery.`,
      [{ text: 'OK' }]
    );
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      <View style={styles.imgWrap}>
        <Image source={{ uri: item.image }} style={styles.img} />
        {item.discount > 0 && (
          <View style={styles.discountTag}>
            <Text style={styles.discountTxt}>{item.discount}% OFF</Text>
          </View>
        )}
        {!item.inStock && (
          <View style={styles.outOfStockTag}>
            <Text style={styles.outOfStockTxt}>Out of Stock</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={styles.title}>{item.name}</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Ionicons name="heart-outline" size={21} color="#dc99e6" />
          </TouchableOpacity>
        </View>
        <Text style={styles.desc}>{item.desc}</Text>
        <View style={styles.rowPrice}>
          <Text style={styles.price}>₹{item.price}</Text>
          <Text style={styles.unit}>/kg</Text>
        </View>
        <View style={styles.rowBtns}>
          <TouchableOpacity
            style={[ styles.cartBtn, !item.inStock && styles.btnDisabled ]}
            onPress={() => addToCart(item)}
            disabled={!item.inStock}
            activeOpacity={0.7}
          >
            <Ionicons name="cart" size={16} color="#fff" />
            <Text style={styles.btnText}>{lastAdded === item.id ? 'Added!' : 'Add to Cart'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[ styles.buyBtn, !item.inStock && styles.btnDisabled ]}
            onPress={() => buyNow(item)}
            disabled={!item.inStock}
            activeOpacity={0.8}
          >
            <Ionicons name="flash" size={17} color="#fff" />
            <Text style={styles.btnText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const cartQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      {/* Header / Cart icon */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Milk Products</Text>
        <TouchableOpacity style={styles.cartIconWrap} activeOpacity={0.7}>
          <Ionicons name="cart-outline" size={25} color="#00334e" />
          {cartQuantity > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartQuantity}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      {/* Product list */}
      <FlatList
        data={MILK_PRODUCTS}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
      {/* Cart summary bar */}
      {cartQuantity > 0 && (
        <Animated.View
          style={[
            styles.cartBar,
            {
              opacity: addAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.8],
              }),
            },
          ]}
        >
          <Ionicons name="cart" color="#fff" size={18} />
          <Text style={styles.cartBarText}>{cartQuantity} item(s) in cart</Text>
          <TouchableOpacity
            style={styles.cartBarBtn}
            onPress={() => Alert.alert('View Cart', 'This would open the cart screen.')}
            activeOpacity={0.7}
          >
            <Text style={styles.cartBarBtnText}>View Cart</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    paddingTop: 19,
    paddingLeft: 22,
    paddingBottom: 4,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#00334e' },
  cartIconWrap: { marginRight: 20 },
  cartBadge: {
    position: 'absolute',
    right: -7,
    top: -6,
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: { color: '#fff', fontWeight: 'bold', fontSize: 11 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 17,
    flexDirection: 'row',
    marginHorizontal: 18,
    marginVertical: 11,
    shadowColor: '#00334e',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
    padding: 12,
    minHeight: 130,
  },
  imgWrap: { marginRight: 13, position: 'relative' },
  img: { width: 87, height: 87, borderRadius: 13, backgroundColor: '#f1f5fb' },
  discountTag: {
    position: 'absolute', left: 0, top: 0,
    backgroundColor: '#ffdc64', borderTopLeftRadius: 11, borderBottomRightRadius: 11,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  discountTxt: { fontWeight: 'bold', color: '#a26b00', fontSize: 12 },
  outOfStockTag: {
    position: 'absolute', bottom: 0, left: 0,
    backgroundColor: 'rgba(200,0,0,0.78)', borderBottomLeftRadius: 11, borderTopRightRadius: 11,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  outOfStockTxt: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  info: { flex: 1, justifyContent: 'space-between' },
  title: { fontSize: 17, fontWeight: 'bold', color: '#00334e', marginBottom: 1 },
  desc: { color: '#666', fontSize: 13, marginBottom: 5, flexShrink: 1 },
  rowPrice: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 3 },
  price: { fontWeight: 'bold', color: '#469849', fontSize: 15 },
  unit: { marginLeft: 2, color: '#666', fontSize: 13 },
  rowBtns: { flexDirection: 'row', gap: 12, marginTop: 9 },
  cartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4E8DF2',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 15,
    marginRight: 8,
  },
  buyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#52C41A',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 15,
  },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#fff', fontWeight: 'bold', marginLeft: 7, fontSize: 13 },
  cartBar: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 18,
    backgroundColor: '#00334e',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    elevation: 8,
    shadowColor: '#333',
    shadowOpacity: 0.13,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  cartBarText: {
    flex: 1,
    color: '#fff',
    marginLeft: 12,
    fontWeight: 'bold',
    fontSize: 15,
  },
  cartBarBtn: {
    backgroundColor: '#4E8DF2',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 14,
  },
  cartBarBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
});

export default MilkProductsList;
