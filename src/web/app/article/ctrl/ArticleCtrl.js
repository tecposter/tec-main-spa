import {web_core} from 'global';

const ArticleRouteDict = {
    saveCommitContent: 'article-save-commit-content',
    publish: 'article-publish'
};
const AppCode = 'main';

export class ArticleCtrl {
    constructor() {
        this.core = web_core();
    }

    async asSaveCommitContent(code, content) {
        await this.core.apiPostJson(
            AppCode,
            ArticleRouteDict.saveCommitContent,
            {code, content}
        );
    }

    async asPublish(code, slug, isPublic) {
        return await this.core.apiPostJson(
            AppCode,
            ArticleRouteDict.publish,
            {code, slug, isPublic}
        );
    }
}
