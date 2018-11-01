const ArticleRouteDict = {
    updateCommitContent: 'article-update-commit-content',
    publish: 'article-publish'
};
const AppCode = 'main';

export class ArticleCtrl {
    constructor(core) {
        this.core = core;
    }

    async asUpdateCommitContent(code, content) {
        await this.core.apiPostJson(
            AppCode,
            ArticleRouteDict.updateCommitContent,
            {code, content}
        );
    }

    async asPublish(code, slug) {
        return await this.core.apiPostJson(
            AppCode,
            ArticleRouteDict.publish,
            {code, slug}
        );
    }
}
