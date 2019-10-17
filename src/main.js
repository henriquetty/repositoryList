import api from './api';

class App {
    constructor() {
        this.repositories = [];
        this.repoForm = window.document.getElementById('repo-form');
        this.input = window.document.querySelector('input[name=repository]');
        this.ul = window.document.getElementById('repo-list');

        this.registerHandlers();
    }

    registerHandlers() {
        this.repoForm.onsubmit = event => this.addRepositories(event);
    }

    setLoading(loading = true) {
        if (loading === true) {
            let loading = window.document.createElement('span');
            loading.appendChild(document.createTextNode('Loading...'));
            loading.setAttribute('id', 'loading');

            this.repoForm.appendChild(loading);
        } else {
            window.document.getElementById('loading').remove();
        }
    }

    async addRepositories(event) {
        event.preventDefault(); //do not reload page
        
        const repoInput = this.input.value;
        if (repoInput.length === 0) {
            return;
        }

        this.setLoading()

        try{
            const response = await api.get(`/repos/${repoInput}`);
            const { name, description, html_url, owner: { avatar_url } } = response.data;

            this.repositories.push({
                name,
                description,
                avatar_url,
                html_url
            });
            
            this.input.value = '';
            this.render()
        } catch (err) {
            alert(`This repository doesn't exist, error: \n${err}`);
        }

        this.setLoading(false);
    }

    render() {
        this.ul.innerHTML = '';

        this.repositories.forEach(repo => {
            let img = window.document.createElement('img');
            img.setAttribute('src', repo.avatar_url);

            let title = window.document.createElement('strong');
            title.appendChild(document.createTextNode(repo.name));

            let description = window.document.createElement('p');
            description.appendChild(document.createTextNode(repo.description));

            let link = window.document.createElement('a');
            link.setAttribute('target', '_blank');
            link.setAttribute('href', repo.html_url)
            link.appendChild(document.createTextNode('Open'));

            let list = window.document.createElement('li');
            list.appendChild(img);
            list.appendChild(title);
            list.appendChild(description);
            list.appendChild(link);

            this.ul.appendChild(list);
        })
    }
}

new App();