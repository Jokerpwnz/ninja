<template>
  <body>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <div class="container">
      <div class="w-full my-4"></div>
      <div v-if="spinner" class="fixed w-100 h-100 opacity-80 bg-purple-800 inset-0 z-50 flex items-center justify-center">
        <svg class="animate-spin -ml-1 mr-3 h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <section>
        <div class="flex">
          <div class="max-w-xs">
            <label for="wallet" class="block text-sm font-medium text-gray-700"
            >Тикер {{ticker}}</label
            >
            <div class="mt-1 relative rounded-md shadow-md">
              <input
                  type="text"
                  v-model="ticker"
                  v-on:keydown.enter="add"
                  name="wallet"
                  id="wallet"
                  class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
                  placeholder="Например DOGE"
              />
            </div>
            <button
                class="dropdown:block relative px-3 py-2 text-sm font-semibold leading-relaxed text-gray-800 transition-colors duration-150 bg-white border border-gray-300 rounded-lg focus:outline-none hover:border-gray-600 focus:shadow-outline focus:border-gray-900"
                role="navigation"
                aria-haspopup="true"
            >
              <div class="flex items-center ">
                <svg
                    class="w-4 h-4 text-gray-500 fill-current"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                >
                  <path
                      d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z"
                  ></path>
                </svg>
                <span class="px-2 text-gray-700">{{currentCurrency}}</span>
                <svg
                    class="w-4 h-4 text-gray-500 fill-current"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                >
                  <path
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                      fill-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <ul
                  class="absolute left-0 hidden w-auto p-2 mt-3 space-y-2 text-sm bg-white border border-gray-100 rounded-lg shadow-lg"
                  aria-label="submenu"
              >
                <a
                    class="inline-block w-full px-2 py-1 font-medium text-gray-600 transition-colors duration-150 rounded-md hover:text-gray-900 focus:outline-none focus:shadow-outline hover:bg-gray-100"
                    href="#"
                    v-for="cur in listCurrency"
                    :key="cur"
                    @click="changeCurrency(cur)"
                >
                  {{cur}}
                </a>
              </ul>
            </button>


          </div>
        </div>
        <button
            type="button"
            @click="add()"
            class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <!-- Heroicon name: solid/mail -->
          <svg
              class="-ml-0.5 mr-2 h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="#ffffff"
          >
            <path
                d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
            ></path>
          </svg>
          Добавить
        </button>
        <div v-if="searchingCoins.length > 0" class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap">
            <span class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
                  v-for="(coin,idx) in searchingCoins"
                  :key="coin+idx"
                  @click="addDataByClick(coin)"
            >
              {{coin}}
            </span>
        </div>
        <div v-if="error" class="text-sm text-red-600">{{error}}</div>
      </section>

      <template v-if="tickers.length > 0">
        <hr class="w-full border-t border-gray-600 my-4" />
        <span>
                  Фильтр <input v-model="filter">
        <!--    ПЕРВЫЙ СППОСО, 2 через WATCH      @input="page = 1"-->
          <button @click="page = page - 1"  :disabled="page <= 1" class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">НАЗАД</button>
          <button @click="page = page + 1"  v-if="hasNextPage" class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500" >ВПЕРЕД</button>

        </span>
      <hr class="w-full border-t border-gray-600 my-4"/>
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div
              v-for="(tick,idx) in paginationTickers"
              :key="tick.name+idx"
              @click="select(tick)"
              :class="{
                'border-4':selectedTicker === tick
              }"
              class="bg-white overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer"
          >
            <div class="px-4 py-5 sm:p-6 text-center">
              <dt class="text-sm font-medium text-gray-500 truncate">
                {{tick.name}} - {{tick.currency}} {{idx}}
              </dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">
                {{tick.price}}
              </dd>
            </div>
            <div class="w-full border-t border-gray-200"></div>
            <button
                @click.stop="remove(tick)"
                class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none"
            >
              <svg
                  class="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="#718096"
                  aria-hidden="true"
              >
                <path
                    fill-rule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                ></path>
              </svg>
              Удалить
            </button>
          </div>
        </dl>
      <hr class="w-full border-t border-gray-600 my-4"/>
      </template>
      <section v-if="selectedTicker" class="relative">
        <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
          {{ selectedTicker.name }} - {{selectedTicker.currency}}
        </h3>
        <div class="flex items-end border-gray-600 border-b border-l h-64">
          <div
              v-for="(bar,idx) in normilizedGraph"
              :key="bar+idx"
              :style="{ height: `${bar}%`}"
              class="bg-purple-800 border w-10 h-24"
          ></div>
        </div>
        <button
            type="button"
            @click="selectedTicker = null"
            class="absolute top-0 right-0"
        >
          <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xmlns:svgjs="http://svgjs.com/svgjs"
              version="1.1"
              width="30"
              height="30"
              x="0"
              y="0"
              viewBox="0 0 511.76 511.76"
              style="enable-background:new 0 0 512 512"
              xml:space="preserve"
          >
          <g>
            <path
                d="M436.896,74.869c-99.84-99.819-262.208-99.819-362.048,0c-99.797,99.819-99.797,262.229,0,362.048    c49.92,49.899,115.477,74.837,181.035,74.837s131.093-24.939,181.013-74.837C536.715,337.099,536.715,174.688,436.896,74.869z     M361.461,331.317c8.341,8.341,8.341,21.824,0,30.165c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    l-75.413-75.435l-75.392,75.413c-4.181,4.16-9.643,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    c-8.341-8.341-8.341-21.845,0-30.165l75.392-75.413l-75.413-75.413c-8.341-8.341-8.341-21.845,0-30.165    c8.32-8.341,21.824-8.341,30.165,0l75.413,75.413l75.413-75.413c8.341-8.341,21.824-8.341,30.165,0    c8.341,8.32,8.341,21.824,0,30.165l-75.413,75.413L361.461,331.317z"
                fill="#718096"
                data-original="#000000"
            ></path>
          </g>
        </svg>
        </button>
      </section>
    </div>
  </div>
  </body>
</template>

<script>

export default {
  name: "App",
  data() {
    return {
      ticker: '',
      filter: '',
      currentCurrency : 'USD',

      coins: [],
      tickers: [],
      selectedTicker: null,
      graph: [],
      listCurrency: ['USD','EUR'],

      error: '',
      spinner: true,
      page: 1,
    }
  },
  created: async function () {
    // const req =  await fetch('https://jsonplaceholder.typicode.com/users/')
    const req =  await fetch('https://min-api.cryptocompare.com/data/all/coinlist?summary=true')
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          return (data);
        });

    for (let idx in req.Data){
      this.coins.push(idx)
    }
    this.coins.sort();

    const tickerData = localStorage.getItem("cryptonomicon-list");

    if (tickerData){
      this.tickers = JSON.parse(tickerData);
      this.tickers.forEach( ticker => {
        this.subscribeToUpdate(ticker.name,ticker.currency);
      });
    }

    this.spinner = false;
  },
  watch: {
    selectedTicker(){
      this.graph = [];
    },
    paginationTickers(){
      if (this.paginationTickers.length === 0 && this.page > 1){
        this.page -= 1;
      }
    },
    tickers(){
      localStorage.setItem('cryptonomicon-list', JSON.stringify(this.tickers));
    }

    // filter(){
    //   // 2 способ
    //   this.page = 1
    //   window.history.pushState(
    //       null,
    //       document.title,
    //       `${window.location.pathname}?filter=${this.filter}$page=${this.page}`
    //   )
    // },
    // page(){
    //   // 2 способ
    //   this.page = 1
    //   window.history.pushState(
    //       null,
    //       document.title,
    //       `${window.location.pathname}?filter=${this.filter}$page=${this.page}`
    //   )
    // }
  },
  computed:{
    searchingCoins(){
      if (this.ticker !== null){
        let res = this.coins.filter(item => {
          return item.includes(this.ticker.toUpperCase())
        });

        return res.slice(0,7);
      }
      return  []
    },
    paginationTickers(){
      return this.filteredTickers.slice(this.startPage, this.endPage)
    },
    filteredTickers() {
      return this.tickers.filter(ticker => ticker.name.includes(this.filter.toUpperCase()))
    },
    startPage() {
      return (this.page - 1) * 6
    },
    endPage() {
      return this.page * 6
    },
    hasNextPage() {
      return this.filteredTickers.length > this.endPage;
    },
    normilizedGraph(){
      const maxValue = Math.max(...this.graph)
      const minValue = Math.min(...this.graph)

      if ( maxValue === minValue) {
        return this.graph.map( () => 50)
      }

      return this.graph.map(
          price => 3 + ((price - minValue) * 97 / (maxValue - minValue))
      )
    }

  },
  methods: {
    subscribeToUpdate(tickerName,tickerCurrency){
      let polling = setInterval(async () => {
        const f = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${tickerName}&tsyms=${tickerCurrency}&api_key=582f816e0eb2102c8633892d87a38c766bd250fdf5460cf3964e9e9ba9e9f08b`)
        const data = await f.json();

        this.tickers.find(t => t.name === tickerName && t.currency === tickerCurrency).price = data[tickerCurrency] > 1 ? data[tickerCurrency].toFixed(2) : data[tickerCurrency].toPrecision(3);
        if (this.selectedTicker && this.selectedTicker.name === tickerName){
          this.graph.push(data[tickerCurrency])
        }

      },3000)

      return polling;
    },
    addDataByClick(coin){
        this.ticker = coin
        this.add()
    },
    changeCurrency(currency){
      this.currentCurrency = currency
    },
    add() {
      if (this.emptyField() || this.uniqField()){
        return false;
      }

      const newTicker = {
        name: this.ticker.toUpperCase(),
        price: '-',
        polling : '-',
        currency: this.currentCurrency
      };

      let pollings = this.subscribeToUpdate(newTicker.name,newTicker.currency);

      newTicker.polling = pollings
      this.tickers = [...this.tickers,newTicker]
      this.ticker = null
      this.error = ''
      this.filter = ''
    },

    emptyField() {
      if (this.ticker === null || this.ticker.length <= 2 || this.ticker.length >= 14) {
        this.error = 'Pls enter correct data';
        return true;
      }
    },
    uniqField() {
      if (
          this.tickers
          .find(t => {
            return t.name === this.ticker.toUpperCase() && t.currency === this.currentCurrency.toUpperCase()}
            ))
      {

        this.error = `${this.ticker} is already exist with currency ${this.currentCurrency}`;
        this.ticker = '';
        return true;
      }

      if (!this.coins.includes(this.ticker.toUpperCase())) {
        this.error = `The ${this.ticker} does not exist`;
        this.ticker = '';
        return true;
      }
    },
    select(tick){
      this.selectedTicker = tick
    },
    remove(tick){
      clearInterval(tick.polling);
      // Глупый способ удаления починил все этим this.tickers = [...this.tickers,newTicker]
      // const  tickerData = JSON.parse(localStorage.getItem("cryptonomicon-list"));
      //
      // let newTicker = tickerData.filter( (item) => {
      //   return item.name !== tick.name;
      // });
      //
      // localStorage.setItem('cryptonomicon-list', JSON.stringify(newTicker));

      this.tickers = this.tickers.filter( t => t !== tick );

      if (this.selectedTicker === tick){
        this.selectedTicker = null;
      }

    },
  }
}
</script>

<style src="./app.css">

</style>
