const getTemplate = (data = [], placeholder, selectedId)=> {
	let text = placeholder ?? 'Placeholder default';
	const items = data.map(item =>{
		let cls = '';
		if(item.id === selectedId){
			text = item.value;
			cls = 'selected'
		}
		return `
			<li class="select__item ${cls}" data-type="item" data-id="${item.id}">${item.value}</li>
		`
	})
	return `
	<div class="select__backdrop" data-type="backdrop"></div>
	<div class="select__input" data-type="input"> 
		<span data-type="value">${text}</span>
		<i class=" select__icon fa fa-angle-down" aria-hidden="true" data-type="icon"></i>
	</div>
	<div class="select__dropdown">
		<ul class="select__list">
			${items.join('')}
		</ul>
	</div>`
}

class Select{
	constructor(selector, options){
		this.$el = document.querySelector(selector);
		this.options = options;
		this.selectedId = this.options.selectedId;

		this.#render();
		this.#setup();
	}

	#render(){
		const {data, placeholder} = this.options;
		this.$el.classList.add('select');
		this.$el.innerHTML = getTemplate(data, placeholder, this.selectedId);
	}

	#setup(){
		this.clickHandler = this.clickHandler.bind(this);
		this.$el.addEventListener('click', this.clickHandler)
		this.$icon = this.$el.querySelector('[data-type="icon"]');
		this.$value = this.$el.querySelector('[data-type="value"]');
	}

	clickHandler(e){
		const {type} = e.target.dataset;

		if(type === 'input'){
			this.toggle();
		}else if(type === 'item'){
			const id = event.target.dataset.id
			this.select(id);
		}else if(type === 'backdrop'){
			this.close();
		}
	}

	get isOpen(){
		return this.$el.classList.contains('open')
	}

	get current(){
		return this.options.data.find(item => item.id === this.selectedId)
	}

	select(id){
		this.selectedId = id; 
		this.$value.textContent =  this.current.value;
		this.$el.querySelectorAll('[data-id]').forEach(item =>{ item.classList.remove('selected')});
		this.$el.querySelector(`[data-id="${id}"]`).classList.add('selected');
		this.close();

		this.options.onSelect ? this.options.onSelect(this.current) : null;
	}

	toggle(){
		this.isOpen ? this.close() : this.open()
	}

	open(){
		this.$el.classList.add('open');
		this.$icon.classList.remove('fa-angle-down');
		this.$icon.classList.add('fa-angle-up');
	}

	close(){
		this.$el.classList.remove('open');
		this.$icon.classList.remove('fa-angle-up');
		this.$icon.classList.add('fa-angle-down');
	}

	destroy(){
		this.$el.removeEventListener('click', this.clickHandler);
		this.$el.innerHTML = '';
	}
}

const select = new Select('#select', {
	placeholder: 'Выбери пожалуйста елемент',
	selectedId: '4',
	data: [
		{id: '1', value: 'HTML5'},
		{id: '2', value: 'CSS3'},
		{id: '3', value: 'JS'},
		{id: '4', value: 'PHP'}
	],
	onSelect(item){
		console.log('selected item', item)
	}
}); 

window.s = select