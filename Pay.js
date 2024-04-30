import StripeCheckout from 'react-stripe-checkout';

const KEY = "pk_test_51P9Gr3DbVWhrqVyHOGss0vVwVn3bFEOecrcgAOciQpj1xnajsdmQbpjUK84qc6uZpCaWpgQAesXtH8v1Y9ZDVGsd00leUjwEKs";

const Pay = () => {

    const onToken = (token) => {
        console.log(token);
    }
    return (
        <div
            style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <StripeCheckout 
                name="Geoprene" 
                image="https://images.unsplash.com/photo-1621433213916-fde39d28e016?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                billingAddress 
                shippingAddress 
                description = "Your total is $550" 
                amount={550}
                token={onToken}
                stripeKey={KEY}
            >
            <button
                style={{
                    border: "none",
                    width: 120,
                    borderRadius: 5,
                    padding: '20px',
                    backgroundColor: 'black',
                    color: 'white',
                    fontWeight: '600',
                    cursor: 'pointer',
                }}
            >
                Pay Now
            </button>
            </StripeCheckout>
        </div>
    );
};

export default Pay;