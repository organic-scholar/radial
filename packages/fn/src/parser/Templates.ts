export let Template = `
<% types.forEach((type)=> { %>
export interface <%= type.name %> {
    <% type.props.forEach((prop)=>{ %>
    <%= prop.name %>:<%= prop.type%>
    <% })%>
}
<% }) %>

<% services.forEach((service)=> { %>
export abstract class <%= service.name %> {

    static args = <%- JSON.stringify( service.args.map((arg)=> arg.name ) ) %>

    public abstract invoke(<%= service.args.map((arg)=> arg.name+':'+arg.type).join(',') %>):Promise<<%=service.returnType%>>
}
<% }) %>
`;