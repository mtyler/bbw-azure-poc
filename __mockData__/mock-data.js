const mockDressResponse = `{
    limit: 10,
    hits: [
      {
        currency: 'USD',
        hitType: 'master',
        image: [Object],
        orderable: true,
        price: 129,
        pricePerUnit: 129,
        productId: '25592581M',
        productName: 'Floral Dress',
        productType: [Object],
        representedProduct: [Object],
        representedProducts: [Array],
        variationAttributes: [Array]
      },
      {
        currency: 'USD',
        hitType: 'master',
        image: [Object],
        orderable: true,
        price: 118,
        pricePerUnit: 118,
        productId: '25593727M',
        productName: 'V-Neck Dress',
        productType: [Object],
        representedProduct: [Object],
        representedProducts: [Array],
        variationAttributes: [Array]
      },
      {
        currency: 'USD',
        hitType: 'master',
        image: [Object],
        orderable: true,
        price: 129,
        pricePerUnit: 129,
        productId: '25589753M',
        productName: 'Pack-And-Go Dress',
        productType: [Object],
        representedProduct: [Object],
        representedProducts: [Array],
        variationAttributes: [Array]
      },
      {
        currency: 'USD',
        hitType: 'master',
        image: [Object],
        orderable: true,
        price: 139,
        pricePerUnit: 139,
        productId: '25642296M',
        productName: 'Navy Pinstripe Dress',
        productType: [Object],
        representedProduct: [Object],
        representedProducts: [Array],
        variationAttributes: [Array]
      },
      {
        currency: 'USD',
        hitType: 'master',
        image: [Object],
        orderable: true,
        price: 129,
        pricePerUnit: 129,
        productId: '25592479M',
        productName: 'Neutral Floral Dress',
        productType: [Object],
        representedProduct: [Object],
        representedProducts: [Array],
        variationAttributes: [Array]
      },
      {
        currency: 'USD',
        hitType: 'master',
        image: [Object],
        orderable: true,
        price: 118,
        pricePerUnit: 118,
        productId: '25642181M',
        productName: 'Floral Jersey Dress',
        productType: [Object],
        representedProduct: [Object],
        representedProducts: [Array],
        variationAttributes: [Array]
      },
      {
        currency: 'USD',
        hitType: 'master',
        image: [Object],
        orderable: true,
        price: 103.99,
        pricePerUnit: 103.99,
        productId: '25589481M',
        productName: 'Sleeveless Sheath Dress',
        productType: [Object],
        representedProduct: [Object],
        representedProducts: [Array],
        variationAttributes: [Array]
      },
      {
        currency: 'USD',
        hitType: 'master',
        image: [Object],
        orderable: true,
        price: 109,
        pricePerUnit: 109,
        productId: '25591911M',
        productName: 'Floral Sheath Dress',
        productType: [Object],
        representedProduct: [Object],
        representedProducts: [Array],
        variationAttributes: [Array]
      },
      {
        currency: 'USD',
        hitType: 'master',
        image: [Object],
        orderable: true,
        price: 138,
        pricePerUnit: 138,
        productId: '25744206M',
        productName: 'Boardroom Sheath Dress',
        productType: [Object],
        representedProduct: [Object],
        representedProducts: [Array],
        variationAttributes: [Array]
      },
      {
        currency: 'USD',
        hitType: 'master',
        image: [Object],
        orderable: true,
        price: 119,
        pricePerUnit: 119,
        productId: '25697212M',
        productName: 'Drape Neck Dress.',
        productType: [Object],
        representedProduct: [Object],
        representedProducts: [Array],
        variationAttributes: [Array]
      }
    ],
    query: 'dress',
    refinements: [
      { attributeId: 'cgid', label: 'Category', values: [Array] },
      {
        attributeId: 'c_refinementColor',
        label: 'Color',
        values: [Array]
      },
      { attributeId: 'price', label: 'Price', values: [Array] },
      { attributeId: 'c_isNew', label: 'New Arrival' },
      { attributeId: 'brand', label: 'brand', values: [Array] }
    ],
    searchPhraseSuggestions: { suggestedPhrases: [ [Object] ], suggestedTerms: [ [Object] ] },
    sortingOptions: [
      { id: 'best-matches', label: 'Best Matches' },
      { id: 'price-low-to-high', label: 'Price Low To High' },
      { id: 'price-high-to-low', label: 'Price High to Low' },
      { id: 'product-name-ascending', label: 'Product Name A - Z' },
      { id: 'product-name-descending', label: 'Product Name Z - A' },
      { id: 'brand', label: 'Brand' },
      { id: 'most-popular', label: 'Most Popular' },
      { id: 'top-sellers', label: 'Top Sellers' }
    ],
    offset: 0,
    total: 42
  }
  [firefox] › example.spec.js:21:1 › API Test #1 with Playwright
  {
    limit: 10,
    hits: [
      {
        currency: 'USD',
        hitType: 'master',
        image: [Object],
        orderable: true,
        price: 129,
        pricePerUnit: 129,
        productId: '25592581M',
        productName: 'Floral Dress',
        productType: [Object],
        representedProduct: [Object],
        representedProducts: [Array],
        variationAttributes: [Array]
      },
      {
        currency: 'USD',
        hitType: 'master',
        image: [Object],
        orderable: true,
        price: 118,
        pricePerUnit: 118,
        productId: '25593727M',
        productName: 'V-Neck Dress',
        productType: [Object],
        representedProduct: [Object],
        representedProducts: [Array],
        variationAttributes: [Array]
      },
      {
        currency: 'USD',
        hitType: 'master',
        image: [Object],
        orderable: true,
        price: 129,
        pricePerUnit: 129,
        productId: '25589753M',
        productName: 'Pack-And-Go Dress',
        productType: [Object],
        representedProduct: [Object],
        representedProducts: [Array],
        variationAttributes: [Array]
      },
      {
        currency: 'USD',
        hitType: 'master',
        image: [Object],
        orderable: true,
        price: 139,
        pricePerUnit: 139,
        productId: '25642296M',
        productName: 'Navy Pinstripe Dress',
        productType: [Object],
        representedProduct: [Object],
        representedProducts: [Array],
        variationAttributes: [Array]
      },
      {
        currency: 'USD',
        hitType: 'master',
        image: [Object],
        orderable: true,
        price: 129,
        pricePerUnit: 129,
        productId: '25592479M',
        productName: 'Neutral Floral Dress',
        productType: [Object],
        representedProduct: [Object],
        representedProducts: [Array],
        variationAttributes: [Array]
      },
      {
        currency: 'USD',
        hitType: 'master',
        image: [Object],
        orderable: true,
        price: 118,
        pricePerUnit: 118,
        productId: '25642181M',
        productName: 'Floral Jersey Dress',
        productType: [Object],
        representedProduct: [Object],
        representedProducts: [Array],
        variationAttributes: [Array]
      },
      {
        currency: 'USD',
        hitType: 'master',
        image: [Object],
        orderable: true,
        price: 103.99,
        pricePerUnit: 103.99,
        productId: '25589481M',
        productName: 'Sleeveless Sheath Dress',
        productType: [Object],
        representedProduct: [Object],
        representedProducts: [Array],
        variationAttributes: [Array]
      },
      {
        currency: 'USD',
        hitType: 'master',
        image: [Object],
        orderable: true,
        price: 109,
        pricePerUnit: 109,
        productId: '25591911M',
        productName: 'Floral Sheath Dress',
        productType: [Object],
        representedProduct: [Object],
        representedProducts: [Array],
        variationAttributes: [Array]
      },
      {
        currency: 'USD',
        hitType: 'master',
        image: [Object],
        orderable: true,
        price: 138,
        pricePerUnit: 138,
        productId: '25744206M',
        productName: 'Boardroom Sheath Dress',
        productType: [Object],
        representedProduct: [Object],
        representedProducts: [Array],
        variationAttributes: [Array]
      },
      {
        currency: 'USD',
        hitType: 'master',
        image: [Object],
        orderable: true,
        price: 119,
        pricePerUnit: 119,
        productId: '25697212M',
        productName: 'Drape Neck Dress.',
        productType: [Object],
        representedProduct: [Object],
        representedProducts: [Array],
        variationAttributes: [Array]
      }
    ],
    query: 'dress',
    refinements: [
      { attributeId: 'cgid', label: 'Category', values: [Array] },
      {
        attributeId: 'c_refinementColor',
        label: 'Color',
        values: [Array]
      },
      { attributeId: 'price', label: 'Price', values: [Array] },
      { attributeId: 'c_isNew', label: 'New Arrival' },
      { attributeId: 'brand', label: 'brand', values: [Array] }
    ],
    searchPhraseSuggestions: { suggestedPhrases: [ [Object] ], suggestedTerms: [ [Object] ] },
    sortingOptions: [
      { id: 'best-matches', label: 'Best Matches' },
      { id: 'price-low-to-high', label: 'Price Low To High' },
      { id: 'price-high-to-low', label: 'Price High to Low' },
      { id: 'product-name-ascending', label: 'Product Name A - Z' },
      { id: 'product-name-descending', label: 'Product Name Z - A' },
      { id: 'brand', label: 'Brand' },
      { id: 'most-popular', label: 'Most Popular' },
      { id: 'top-sellers', label: 'Top Sellers' }
    ],
    offset: 0,
    total: 42
  }
  [webkit] › example.spec.js:21:1 › API Test #1 with Playwright
  {
    limit: 10,
    hits: [
      {
        currency: 'USD',
        hitType: 'master',
        image: [Object],
        orderable: true,
        price: 129,
        pricePerUnit: 129,
        productId: '25592581M',
        productName: 'Floral Dress',
        productType: [Object],
        representedProduct: [Object],
        representedProducts: [Array],
        variationAttributes: [Array]
      },
      {
        currency: 'USD',
        hitType: 'master',
        image: [Object],
        orderable: true,
        price: 118,
        pricePerUnit: 118,
        productId: '25593727M',
        productName: 'V-Neck Dress',
        productType: [Object],
        representedProduct: [Object],
        representedProducts: [Array],
        variationAttributes: [Array]
      },
      {
        currency: 'USD',
        hitType: 'master',
        image: [Object],
        orderable: true,
        price: 129,
        pricePerUnit: 129,
        productId: '25589753M',
        productName: 'Pack-And-Go Dress',
        productType: [Object],
        representedProduct: [Object],
        representedProducts: [Array],
        variationAttributes: [Array]
      },
      {
        currency: 'USD',
        hitType: 'master',
        image: [Object],
        orderable: true,
        price: 139,
        pricePerUnit: 139,
        productId: '25642296M',
        productName: 'Navy Pinstripe Dress',
        productType: [Object],
        representedProduct: [Object],
        representedProducts: [Array],
        variationAttributes: [Array]
      },
      {
        currency: 'USD',
        hitType: 'master',
        image: [Object],
        orderable: true,
        price: 129,
        pricePerUnit: 129,
        productId: '25592479M',
        productName: 'Neutral Floral Dress',
        productType: [Object],
        representedProduct: [Object],
        representedProducts: [Array],
        variationAttributes: [Array]
      },
      {
        currency: 'USD',
        hitType: 'master',
        image: [Object],
        orderable: true,
        price: 118,
        pricePerUnit: 118,
        productId: '25642181M',
        productName: 'Floral Jersey Dress',
        productType: [Object],
        representedProduct: [Object],
        representedProducts: [Array],
        variationAttributes: [Array]
      },
      {
        currency: 'USD',
        hitType: 'master',
        image: [Object],
        orderable: true,
        price: 103.99,
        pricePerUnit: 103.99,
        productId: '25589481M',
        productName: 'Sleeveless Sheath Dress',
        productType: [Object],
        representedProduct: [Object],
        representedProducts: [Array],
        variationAttributes: [Array]
      },
      {
        currency: 'USD',
        hitType: 'master',
        image: [Object],
        orderable: true,
        price: 109,
        pricePerUnit: 109,
        productId: '25591911M',
        productName: 'Floral Sheath Dress',
        productType: [Object],
        representedProduct: [Object],
        representedProducts: [Array],
        variationAttributes: [Array]
      },
      {
        currency: 'USD',
        hitType: 'master',
        image: [Object],
        orderable: true,
        price: 138,
        pricePerUnit: 138,
        productId: '25744206M',
        productName: 'Boardroom Sheath Dress',
        productType: [Object],
        representedProduct: [Object],
        representedProducts: [Array],
        variationAttributes: [Array]
      },
      {
        currency: 'USD',
        hitType: 'master',
        image: [Object],
        orderable: true,
        price: 119,
        pricePerUnit: 119,
        productId: '25697212M',
        productName: 'Drape Neck Dress.',
        productType: [Object],
        representedProduct: [Object],
        representedProducts: [Array],
        variationAttributes: [Array]
      }
    ],
    query: 'dress',
    refinements: [
      { attributeId: 'cgid', label: 'Category', values: [Array] },
      {
        attributeId: 'c_refinementColor',
        label: 'Color',
        values: [Array]
      },
      { attributeId: 'price', label: 'Price', values: [Array] },
      { attributeId: 'c_isNew', label: 'New Arrival' },
      { attributeId: 'brand', label: 'brand', values: [Array] }
    ],
    searchPhraseSuggestions: { suggestedPhrases: [ [Object] ], suggestedTerms: [ [Object] ] },
    sortingOptions: [
      { id: 'best-matches', label: 'Best Matches' },
      { id: 'price-low-to-high', label: 'Price Low To High' },
      { id: 'price-high-to-low', label: 'Price High to Low' },
      { id: 'product-name-ascending', label: 'Product Name A - Z' },
      { id: 'product-name-descending', label: 'Product Name Z - A' },
      { id: 'brand', label: 'Brand' },
      { id: 'most-popular', label: 'Most Popular' },
      { id: 'top-sellers', label: 'Top Sellers' }
    ],
    offset: 0,
    total: 42
  }`

const mockRadialTaxResponse = `<?xml version="1.0" encoding="UTF-8"?>
    <TaxDutyQuoteResponse xmlns="http://api.gsicommerce.com/schema/checkout/1.0">
        <Shipping>
            <ShipGroups>
                <ShipGroup id="shipgroup_Economy_Ground">
                    <DestinationTarget ref="dest_Economy_Ground"/>
                    <Items>
                        <OrderItem lineNumber="1">
                            <ItemId type="VPN">020519316</ItemId>
                            <ItemDesc>Kitchen Lemon Gentle</ItemDesc>
                            <HTSCode/>
                            <Quantity>1</Quantity>
                            <Pricing>
                                <Merchandise>
                                    <Amount>7.5</Amount>
                                    <TaxData>
                                        <TaxClass>76800</TaxClass>
                                        <Taxes>
                                            <Tax taxType="SALES" taxability="TAXABLE">
                                                <Situs>ADMINISTRATIVE_ORIGIN</Situs>
                                                <Jurisdiction jurisdictionLevel="STATE" jurisdictionId="28101">OHIO</Jurisdiction>
                                                <Imposition impositionType="General Sales and Use Tax">Sales and Use Tax</Imposition>
                                                <EffectiveRate>0.0575</EffectiveRate>
                                                <TaxableAmount>7.5</TaxableAmount>
                                                <CalculatedTax>0.43</CalculatedTax>
                                            </Tax>
                                            <Tax taxType="SALES" taxability="TAXABLE">
                                                <Situs>ADMINISTRATIVE_ORIGIN</Situs>
                                                <Jurisdiction jurisdictionLevel="COUNTY" jurisdictionId="28565">FRANKLIN</Jurisdiction>
                                                <Imposition impositionType="General Sales and Use Tax">Local Sales and Use Tax</Imposition>
                                                <EffectiveRate>0.0125</EffectiveRate>
                                                <TaxableAmount>7.5</TaxableAmount>
                                                <CalculatedTax>0.09</CalculatedTax>
                                            </Tax>
                                            <Tax taxType="SALES" taxability="TAXABLE">
                                                <Situs>ADMINISTRATIVE_ORIGIN</Situs>
                                                <Jurisdiction jurisdictionLevel="DISTRICT" jurisdictionId="78115">CENTRAL OHIO TRANSIT AUTHORITY</Jurisdiction>
                                                <Imposition impositionType="General Sales and Use Tax">Local Sales and Use Tax</Imposition>
                                                <EffectiveRate>0.005</EffectiveRate>
                                                <TaxableAmount>7.5</TaxableAmount>
                                                <CalculatedTax>0.04</CalculatedTax>
                                            </Tax>
                                        </Taxes>
                                    </TaxData>
                                    <UnitPrice>7.5</UnitPrice>
                                </Merchandise>
                                <Shipping>
                                    <Amount>9.99</Amount>
                                    <TaxData>
                                        <TaxClass>91000</TaxClass>
                                        <Taxes>
                                            <Tax taxType="SALES" taxability="TAXABLE">
                                                <Situs>ADMINISTRATIVE_ORIGIN</Situs>
                                                <Jurisdiction jurisdictionLevel="STATE" jurisdictionId="28101">OHIO</Jurisdiction>
                                                <Imposition impositionType="General Sales and Use Tax">Sales and Use Tax</Imposition>
                                                <EffectiveRate>0.0575</EffectiveRate>
                                                <TaxableAmount>9.99</TaxableAmount>
                                                <CalculatedTax>0.57</CalculatedTax>
                                            </Tax>
                                            <Tax taxType="SALES" taxability="TAXABLE">
                                                <Situs>ADMINISTRATIVE_ORIGIN</Situs>
                                                <Jurisdiction jurisdictionLevel="COUNTY" jurisdictionId="28565">FRANKLIN</Jurisdiction>
                                                <Imposition impositionType="General Sales and Use Tax">Local Sales and Use Tax</Imposition>
                                                <EffectiveRate>0.0125</EffectiveRate>
                                                <TaxableAmount>9.99</TaxableAmount>
                                                <CalculatedTax>0.13</CalculatedTax>
                                            </Tax>
                                            <Tax taxType="SALES" taxability="TAXABLE">
                                                <Situs>ADMINISTRATIVE_ORIGIN</Situs>
                                                <Jurisdiction jurisdictionLevel="DISTRICT" jurisdictionId="78115">CENTRAL OHIO TRANSIT AUTHORITY</Jurisdiction>
                                                <Imposition impositionType="General Sales and Use Tax">Local Sales and Use Tax</Imposition>
                                                <EffectiveRate>0.005</EffectiveRate>
                                                <TaxableAmount>9.99</TaxableAmount>
                                                <CalculatedTax>0.05</CalculatedTax>
                                            </Tax>
                                        </Taxes>
                                    </TaxData>
                                </Shipping>
                            </Pricing>
                        </OrderItem>
                    </Items>
                </ShipGroup>
            </ShipGroups>
            <Destinations>
                <MailingAddress id="dest_Economy_Ground">
                    <PersonName>
                        <LastName>djfkjfk</LastName>
                        <FirstName>joshd</FirstName>
                    </PersonName>
                    <Address>
                        <Line1>123 w main st</Line1>
                        <City>Columbus</City>
                        <MainDivision>OH</MainDivision>
                        <CountryCode>US</CountryCode>
                        <PostalCode>43220</PostalCode>
                    </Address>
                </MailingAddress>
            </Destinations>
        </Shipping>
        <TaxTransactionId>3964174</TaxTransactionId>
    </TaxDutyQuoteResponse>`

    const mockTestResponse = `{
        "login": "vnglst",
        "id": 34576930001,
        "avatar_url": "https://avatars.githubusercontent.com/u/3457693?v=3",
        "gravatar_id": "",
        "url": "https://api.github.com/users/vnglst",
        "html_url": "https://github.com/vnglst",
        "followers_url": "https://api.github.com/users/vnglst/followers",
        "following_url": "https://api.github.com/users/vnglst/following{/other_user}",
        "gists_url": "https://api.github.com/users/vnglst/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/vnglst/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/vnglst/subscriptions",
        "organizations_url": "https://api.github.com/users/vnglst/orgs",
        "repos_url": "https://api.github.com/users/vnglst/repos",
        "events_url": "https://api.github.com/users/vnglst/events{/privacy}",
        "received_events_url": "https://api.github.com/users/vnglst/received_events",
        "type": "User",
        "site_admin": false,
        "name": "Koen van Gilst",
        "company": null,
        "blog": "www.koenvangilst.nl",
        "location": "Utrecht, The Netherlands",
        "email": "koen@koenvangilst.nl",
        "hireable": true,
        "bio": "Web Developer & Translator | JavaScript, Node, Express, React | Creator of @TermSearch ",
        "public_repos": 45,
        "public_gists": 17,
        "followers": 21,
        "following": 75,
        "created_at": "2013-02-02T16:06:27Z",
        "updated_at": "2017-02-04T14:24:18Z"
      }`