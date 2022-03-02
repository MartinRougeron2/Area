# Backend

## API

Link to postman doc: https://documenter.getpostman.com/view/18222595/UVksLZFJ


## Models
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link type="text/css" rel="stylesheet" href="styles/graphdoc.css" />
    <title>Graphql schema documentation</title>
    <link href="https://fonts.googleapis.com/css?family=Ubuntu+Mono:400,700" rel="stylesheet"><link type="text/css" rel="stylesheet" href="assets/code.css" /><link type="text/css" rel="stylesheet" href="assets/require-by.css" />
</head>
<body class="slds-scrollable--y">
    <nav class="slds-grid slds-grid--vertical slds-col--rule-right">
        <header class="slds-p-around--medium slds-col slds-shrik slds-grow-none">
            <button class="slds-button slds-button--icon slds-float--right js-toggle-navigation less-than-medium">
                <i class="material-icons">close</i>
            </button>
                <h3 class="slds-text-heading--medium"><a href="">GraphQL Schema</a></h3>
            <div class="slds-p-top--small">
                <input id="type-search" type="text" placeholder="Search a type" autofocus="" class="slds-input" />
            </div>
        </header>
        <div id="navication-scroll" class="slds-scrollable--y slds-col slds-grow">
<div class="slds-grid slds-grid--vertical slds-navigation-list--vertical">
    <h4 class="slds-text-title--caps slds-p-around--medium">Schema</h4>
    <ul>
        <li  title="Query">
            <a href="backend/documentation/schema/query.doc.html" class="slds-navigation-list--vertical__action slds-text-link--reset slds-truncate">
                Query
            </a>
        </li>
        <li  title="Mutation">
            <a href="backend/documentation/schema/mutation.doc.html" class="slds-navigation-list--vertical__action slds-text-link--reset slds-truncate">
                Mutation
            </a>
        </li>
    </ul>
</div>
<div class="slds-grid slds-grid--vertical slds-navigation-list--vertical">
    <h4 class="slds-text-title--caps slds-p-around--medium">Scalars</h4>
    <ul>
        <li  title="Boolean">
            <a href="backend/documentation/schema/boolean.doc.html" class="slds-navigation-list--vertical__action slds-text-link--reset slds-truncate">
                Boolean
            </a>
        </li>
        <li  title="ID">
            <a href="backend/documentation/schema/id.doc.html" class="slds-navigation-list--vertical__action slds-text-link--reset slds-truncate">
                ID
            </a>
        </li>
        <li  title="String">
            <a href="backend/documentation/schema/string.doc.html" class="slds-navigation-list--vertical__action slds-text-link--reset slds-truncate">
                String
            </a>
        </li>
    </ul>
</div>
<div class="slds-grid slds-grid--vertical slds-navigation-list--vertical">
    <h4 class="slds-text-title--caps slds-p-around--medium">Enums</h4>
    <ul>
        <li  title="ActionType">
            <a href="backend/documentation/schema/actiontype.doc.html" class="slds-navigation-list--vertical__action slds-text-link--reset slds-truncate">
                ActionType
            </a>
        </li>
        <li  title="__DirectiveLocation">
            <a href="directivelocation.spec.html" class="slds-navigation-list--vertical__action slds-text-link--reset slds-truncate">
                __DirectiveLocation
            </a>
        </li>
        <li  title="__TypeKind">
            <a href="typekind.spec.html" class="slds-navigation-list--vertical__action slds-text-link--reset slds-truncate">
                __TypeKind
            </a>
        </li>
    </ul>
</div>
<div class="slds-grid slds-grid--vertical slds-navigation-list--vertical">
    <h4 class="slds-text-title--caps slds-p-around--medium">Objects</h4>
    <ul>
        <li  title="BaseAction">
            <a href="backend/documentation/schema/baseaction.doc.html" class="slds-navigation-list--vertical__action slds-text-link--reset slds-truncate">
                BaseAction
            </a>
        </li>
        <li  title="BayAction">
            <a href="backend/documentation/schema/bayaction.doc.html" class="slds-navigation-list--vertical__action slds-text-link--reset slds-truncate">
                BayAction
            </a>
        </li>
        <li  title="Links">
            <a href="backend/documentation/schema/links.doc.html" class="slds-navigation-list--vertical__action slds-text-link--reset slds-truncate">
                Links
            </a>
        </li>
        <li  title="ResultUser">
            <a href="backend/documentation/schema/resultuser.doc.html" class="slds-navigation-list--vertical__action slds-text-link--reset slds-truncate">
                ResultUser
            </a>
        </li>
        <li  title="Service">
            <a href="backend/documentation/schema/service.doc.html" class="slds-navigation-list--vertical__action slds-text-link--reset slds-truncate">
                Service
            </a>
        </li>
        <li  title="UniqueAction">
            <a href="backend/documentation/schema/uniqueaction.doc.html" class="slds-navigation-list--vertical__action slds-text-link--reset slds-truncate">
                UniqueAction
            </a>
        </li>
        <li  title="User">
            <a href="backend/documentation/schema/user.doc.html" class="slds-navigation-list--vertical__action slds-text-link--reset slds-truncate">
                User
            </a>
        </li>
        <li  title="__Directive">
            <a href="directive.spec.html" class="slds-navigation-list--vertical__action slds-text-link--reset slds-truncate">
                __Directive
            </a>
        </li>
        <li  title="__EnumValue">
            <a href="enumvalue.spec.html" class="slds-navigation-list--vertical__action slds-text-link--reset slds-truncate">
                __EnumValue
            </a>
        </li>
        <li  title="__Field">
            <a href="field.spec.html" class="slds-navigation-list--vertical__action slds-text-link--reset slds-truncate">
                __Field
            </a>
        </li>
        <li  title="__InputValue">
            <a href="inputvalue.spec.html" class="slds-navigation-list--vertical__action slds-text-link--reset slds-truncate">
                __InputValue
            </a>
        </li>
        <li  title="__Schema">
            <a href="schema.spec.html" class="slds-navigation-list--vertical__action slds-text-link--reset slds-truncate">
                __Schema
            </a>
        </li>
        <li  title="__Type">
            <a href="type.spec.html" class="slds-navigation-list--vertical__action slds-text-link--reset slds-truncate">
                __Type
            </a>
        </li>
    </ul>
</div>
<div class="slds-grid slds-grid--vertical slds-navigation-list--vertical">
    <h4 class="slds-text-title--caps slds-p-around--medium">Input Objects</h4>
    <ul>
        <li  title="CommunicationInput">
            <a href="backend/documentation/schema/communicationinput.doc.html" class="slds-navigation-list--vertical__action slds-text-link--reset slds-truncate">
                CommunicationInput
            </a>
        </li>
        <li  title="InputBaseAction">
            <a href="backend/documentation/schema/inputbaseaction.doc.html" class="slds-navigation-list--vertical__action slds-text-link--reset slds-truncate">
                InputBaseAction
            </a>
        </li>
        <li  title="InputBaseActionAttach">
            <a href="backend/documentation/schema/inputbaseactionattach.doc.html" class="slds-navigation-list--vertical__action slds-text-link--reset slds-truncate">
                InputBaseActionAttach
            </a>
        </li>
        <li  title="InputBayAction">
            <a href="backend/documentation/schema/inputbayaction.doc.html" class="slds-navigation-list--vertical__action slds-text-link--reset slds-truncate">
                InputBayAction
            </a>
        </li>
        <li  title="InputLink">
            <a href="backend/documentation/schema/inputlink.doc.html" class="slds-navigation-list--vertical__action slds-text-link--reset slds-truncate">
                InputLink
            </a>
        </li>
        <li  title="InputService">
            <a href="backend/documentation/schema/inputservice.doc.html" class="slds-navigation-list--vertical__action slds-text-link--reset slds-truncate">
                InputService
            </a>
        </li>
        <li  title="InputUser">
            <a href="backend/documentation/schema/inputuser.doc.html" class="slds-navigation-list--vertical__action slds-text-link--reset slds-truncate">
                InputUser
            </a>
        </li>
        <li  title="OptionsInputType">
            <a href="backend/documentation/schema/optionsinputtype.doc.html" class="slds-navigation-list--vertical__action slds-text-link--reset slds-truncate">
                OptionsInputType
            </a>
        </li>
        <li  title="UniqueActionInput">
            <a href="backend/documentation/schema/uniqueactioninput.doc.html" class="slds-navigation-list--vertical__action slds-text-link--reset slds-truncate">
                UniqueActionInput
            </a>
        </li>
        <li  title="UpdateBayAction">
            <a href="backend/documentation/schema/updatebayaction.doc.html" class="slds-navigation-list--vertical__action slds-text-link--reset slds-truncate">
                UpdateBayAction
            </a>
        </li>
    </ul>
</div>
<div class="slds-grid slds-grid--vertical slds-navigation-list--vertical">
    <h4 class="slds-text-title--caps slds-p-around--medium">Directives</h4>
    <ul>
        <li  title="deprecated">
            <a href="backend/documentation/schema/deprecated.doc.html" class="slds-navigation-list--vertical__action slds-text-link--reset slds-truncate">
                deprecated
            </a>
        </li>
        <li  title="include">
            <a href="backend/documentation/schema/include.doc.html" class="slds-navigation-list--vertical__action slds-text-link--reset slds-truncate">
                include
            </a>
        </li>
        <li  title="skip">
            <a href="backend/documentation/schema/skip.doc.html" class="slds-navigation-list--vertical__action slds-text-link--reset slds-truncate">
                skip
            </a>
        </li>
        <li  title="specifiedBy">
            <a href="backend/documentation/schema/specifiedby.doc.html" class="slds-navigation-list--vertical__action slds-text-link--reset slds-truncate">
                specifiedBy
            </a>
        </li>
    </ul>
</div>
        </div>
    </nav>
    <main><section class="title slds-theme--inverse">
    <div class="container slds-grid">
        <div>
        <button class="slds-button js-toggle-navigation less-than-medium">
            <i class="material-icons slds-button__icon slds-button__icon--left">menu</i>
            <span class="slds-text-title--caps">Types<span>
        </button>
        </div>
        </div>
    </div>
    <div class="container">

        <h1 class="slds-text-heading--large">Graphql schema documentation</h1>
        <div class="slds-text-body--regular"></div>
    </div>
</section>
<section>
    <div class="container">
        <h2 id="graphql-schema-definition" class="graphdoc-section__title slds-text-heading--medium slds-m-top--small">
            <a href="#graphql-schema-definition">
                <i class="material-icons">link</i>
            </a>
            GraphQL Schema definition
        </h2>
        <code class="highlight"><ul class="code" style="padding-left:28px"><li><span class="keyword operator ts">schema</span> {</li><li></li><li><span class="tab"><span class="meta">query</span>: <a class="support type" href="backend/documentation/schema/query.doc.html">Query</a></span></li><li></li><li><span class="tab"><span class="meta">mutation</span>: <a class="support type" href="backend/documentation/schema/mutation.doc.html">Mutation</a></span></li><li>}</li></ul></code>
    </div>
</section>
<footer>
<div class="container slds-p-around--large">
    <p class="slds-text-align--right slds-text-title--caps">
        Generated with <a href="https://github.com/2fd/graphdoc#readme" target="_blank">graphdoc 2.4.0</a>
    </p>
</div>
</footer>
</main>
    <script src="scripts/focus-active.js"></script>
    <script src="scripts/filter-types.js"></script>
    <script src="scripts/toggle-navigation.js"></script>
</body>
